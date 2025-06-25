import { Request, Response } from 'express';
import { InvitationService } from '@/services/invitation.service';
import { z } from 'zod';
import { MONGO_OBJECT_ID_REGEX } from '@/constants/validations';

const InvitationSendEmailSchema = z.object({
  receiverName: z.string({ required_error: 'Receiver Name is required' }),
  // receiverName: z
  //   .string({ required_error: 'Receiver Name is required' })
  //   .min(1, { message: 'Receiver Name is required' }),
  receiverEmail: z
    .string({ required_error: 'Receiver Email is required' }),
  // receiverEmail: z
  //   .string({ required_error: 'Receiver Email is required' })
  //   .min(1, { message: 'Receiver Email is required' })
  //   .email({ message: 'Invalid email address' }),
  senderId: z.string({ required_error: 'SenderId is required' }),
  // senderId: z
  //   .string({ required_error: 'SenderId is required' })
  //   .min(1, { message: 'SenderId is required' }),
});

const InvitationIdSchema = z.object({
  invitationId: z
    .string({ required_error: 'InvitationId is required' })
    .min(1, { message: 'InvitationId is required' })
    .regex(MONGO_OBJECT_ID_REGEX, 'Invalid invitationId format'),
});

const InvitationTokenSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
});

export const InvitationController = {
  getAllInvitations: async (_req: Request, res: Response) => {
    const invitations = await InvitationService.getAllInvitations();
    res.status(200).json({ data: invitations });
  },

  sendInvitation: async (req: Request, res: Response) => {
    const { receiverName, receiverEmail, senderId } =
      InvitationSendEmailSchema.parse(req.body);
    const invitation = await InvitationService.sendInvitation(
      receiverName,
      receiverEmail,
      senderId
    );
    res.status(200).json({ data: invitation });
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
