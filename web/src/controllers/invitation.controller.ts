import { Request, Response } from 'express';
import { InvitationService } from '@/services/invitation.service';
import { z } from 'zod';

const InvitationSendEmailSchema = z.object({
  receiverName: z.string(),
  receiverEmail: z.string().email(),
  senderId: z.string(),
});

const InvitationIdSchema = z.object({
  invitationId: z.string(),
});

const InvitationTokenSchema = z.object({
  token: z.string(),
});

export const InvitationController = {
  getAllInvitations: async (_req: Request, res: Response) => {
    const invitations = await InvitationService.getAllInvitations();
    res.status(200).json({ data: invitations });
  },

  sendInvitation: async (req: Request, res: Response) => {
    const emailData = InvitationSendEmailSchema.parse(req.body);
    const sendingEmail = await InvitationService.sendInvitation(
      emailData.receiverName,
      emailData.receiverEmail,
      emailData.senderId
    );
    res.status(200).json({ data: sendingEmail });
  },

  revokeInvitation: async (req: Request, res: Response) => {
    const { invitationId } = InvitationIdSchema.parse(req.params);
    const revokedInvitation =
      await InvitationService.revokeInvitation(invitationId);
    res.status(200).json({ data: revokedInvitation });
  },

  validateInvitation: async (req: Request, res: Response) => {
    const { token } = InvitationTokenSchema.parse(req.body);
    const foundInvitation = await InvitationService.validateInvitation(token);
    res.status(200).json({ data: foundInvitation });
  },
};
