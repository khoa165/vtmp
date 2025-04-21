import { EnvConfig } from '@/config/env';
import nodemailer from 'nodemailer';

const config = EnvConfig.get();
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: config.GMAIL_EMAIL,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

export const EmailService = {
  getInvitationEmailTemplate: (name: string, email: string, token: string) => {
    const link = `viettechmentorship.com?token=${token}`;
    return {
      email,
      subject: 'Invitation to join VTMP',
      body: `<h1>Invitation to join VTMP</h1>
        <p>Dear ${name},</p>
        <p>We are excited to invite you to join our VTMP community. As a member, you will have access to exclusive content, resources, and networking opportunities.</p>
        <p>To accept this invitation, please click the link below:</p>
        <a href=${link} target="_blank">Join the community!</a>
        `,
    };
  },

  sendEmail: async ({
    email,
    subject,
    body,
  }: {
    email: string;
    subject: string;
    body: string;
  }) => {
    const mailOptions = {
      from: config.GMAIL_EMAIL,
      to: email,
      subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error: unknown) {
      console.error('error sending email ', error);
      return false;
    }
  },
};
