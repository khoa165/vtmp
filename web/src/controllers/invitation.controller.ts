import { InvitationService } from '@/services/invitation.service';
import { Request, Response } from 'express';

export const InvitationController = {
  sendInvitationEmail: async (req: Request, res: Response) => {
    const link = `viettechmentorship.com?token=${req.body.token}`;
    const sentContent = {
      email: 'nguyenhainam8668@gmail.com',
      subject: 'Invitation to join VTMP',
      body: `<h1>Invitation to join VTMP</h1>
      <p>Dear ${req.body.name},</p>
      <p>We are excited to invite you to join our VTMP community. As a member, you will have access to exclusive content, resources, and networking opportunities.</p>
      <p>To accept this invitation, please click the link below:</p>
      <a href=${link} target="_blank">Join the community!</a>
      `,
    };

    const sent = await InvitationService.sendInvitationEmail(sentContent);
    res.status(200).json({ data: sent });
  },
};
