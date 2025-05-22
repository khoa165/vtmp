import { EnvConfig } from '@/config/env';
import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: EnvConfig.get().GMAIL_EMAIL,
        pass: EnvConfig.get().GMAIL_APP_PASSWORD,
      },
    });
  }

  getInvitationEmailTemplate(name: string, email: string, token: string) {
    const link = `${EnvConfig.get().VTMP_WEB_URL}?token=${token}`;
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
  }

  getPasswordResetTemplate(name: string, email: string, token: string) {
    const link = `${EnvConfig.get().VTMP_WEB_URL}/reset-password?token=${token}`;
    return {
      email,
      subject: 'Reset Your Password',
      body: `<h1>Reset Your Password</h1>
      <p> Hi ${name}, </p>
      <p>We received a request to reset your password for your VTMP account. To proceed, please click the link below:</p>
      <a href="${link}" target="_blank">Reset Password</a>
      <p>This link will expire in 10 minutes for security reason and please DO NOT SHARE IT with anyone.</p>`,
    };
  }

  async sendEmail({
    email,
    subject,
    body,
  }: {
    email: string;
    subject: string;
    body: string;
  }) {
    const mailOptions = {
      from: EnvConfig.get().GMAIL_EMAIL,
      to: email,
      subject,
      html: body,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
