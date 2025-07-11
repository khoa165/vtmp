import nodemailer from 'nodemailer';

import { EnvConfig } from '@/config/env';
import { EmailError } from '@/utils/errors';

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

  getInvitationEmailTemplate(
    name: string,
    email: string,
    token: string,
    webUrl: string
  ) {
    const link = `${webUrl}/signup?token=${token}`;
    return {
      email,
      subject: 'Invitation to join VTMP',
      body: `
            <div style="margin-bottom: 24px;">
              <img src="https://comtdk.github.io/treverse-logo/primary-logo-gradient.png" alt="Treverse Logo" style="max-width: 180px; height: auto;" />
            </div>
            <h1>Invitation to join VTMP</h1>
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
            <p style="margin-bottom: 16px;">Dear <strong>${name}</strong>,</p>

            <p style="margin-bottom: 16px;">
              We are excited to invite you to join our <strong>VTMP community</strong>. As a member, you will have access to
              exclusive content, resources, and networking opportunities.
            </p>

            <p style="margin-bottom: 24px;">
              To accept this invitation, please click the button below:
            </p>

            <a href="${link}" target="_blank" 
              style="
                display: inline-block;
                background-color: #a3f890;
                background-image: linear-gradient(to right, #F8FF6A, #66FFCC);
                color: black;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
              ">
              Join the community!
            </a>
          </div>
        `,
    };
  }

  getPasswordResetTemplate(name: string, email: string, token: string) {
    const webUrl =
      EnvConfig.get().NODE_ENV === 'DEV'
        ? 'http://localhost:3000'
        : EnvConfig.get().VTMP_WEB_URL;
    const link = `${webUrl}/reset-password?token=${token}`;
    return {
      email,
      subject: 'Reset Your Password',
      body: `<h1>Reset Your Password</h1>
      <p> Hi ${name}, </p>
      <p>We received a request to reset your password for your VTMP account. To proceed, please click the link below:</p>
      <a href=${link} target="_blank">Reset Password</a>
      <p>For security reason, this link will expire in 10 minutes and please DO NOT SHARE IT with anyone.</p>`,
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
      from: `"Treverse 👋" <${EnvConfig.get().GMAIL_EMAIL}>`,
      to: email,
      subject,
      html: body,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new EmailError('Failed to send email', { error });
    }
  }
}

let emailServiceInstance: EmailService | null = null;

export const getEmailService = (): EmailService => {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
};
