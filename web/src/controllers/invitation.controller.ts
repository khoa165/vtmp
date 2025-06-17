import { Request, Response } from 'express';
import { InvitationService } from '@/services/invitation.service';
import { z } from 'zod';

const InvitationSendEmailSchema = z.object({
  receiverName: z.string({ required_error: 'Receiver Name is required' }),
  receiverEmail: z
    .string({ required_error: 'Receiver Email is required' })
    .email({ message: 'Invalid email address' }),
  senderId: z.string({ required_error: 'SenderId is required' }),
});

const InvitationResendSchema = z.object({
  invitationId: z.string({ required_error: 'Invitation ID is required' }),
  isResend: z.boolean().optional(),
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
    if (req.body.invitationId && req.body.isResend) {
      const { invitationId } = InvitationResendSchema.parse(req.body);
      const resentInvitation = await InvitationService.sendOrResendInvitation({
        invitationId,
        isResend: true,
      });
      res.status(200).json({ data: resentInvitation });
    } else {
      const { receiverName, receiverEmail, senderId } =
        InvitationSendEmailSchema.parse(req.body);
      const invitation = await InvitationService.sendOrResendInvitation({
        receiverName,
        receiverEmail,
        senderId,
      });
      res.status(200).json({ data: invitation });
    }
  },

  revokeInvitation: async (req: Request, res: Response) => {
    const { invitationId } = InvitationIdSchema.parse(req.params);
    const revokedInvitation =
      await InvitationService.revokeInvitation(invitationId);
    res.status(200).json({ data: revokedInvitation });
  },

  validateInvitation: async (req: Request, res: Response) => {
    const { token } = InvitationTokenSchema.parse(req.body);
    const validatedInvitation =
      await InvitationService.validateInvitation(token);
    res.status(200).json({ data: validatedInvitation });
  },
};
