import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  body: string
) => {
  const mailOptions = {
    from: process.env.GOOGLE_MAIL_APP_EMAIL,
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
};
