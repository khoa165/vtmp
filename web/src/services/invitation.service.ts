import { sendEmail } from '@/utils/email';

export const InvitationService = {
  sendInvitationEmail: async ({
    email,
    subject,
    body,
  }: {
    email: string;
    subject: string;
    body: string;
  }) => {
    const sent = await sendEmail(email, subject, body);
    return sent;
  },
};
