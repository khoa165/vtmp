import { InvitationStatus } from '@vtmp/common/constants';
import { z } from 'zod';

export const InvitationSchema = z.object({
  _id: z.string(),
  receiverEmail: z.string().email({ message: 'Invalid email address' }),
  receiverName: z.string().optional(),
  status: z.nativeEnum(InvitationStatus, {
    message: 'Invalid invitation status',
  }),
  expiryDate: z.string(),
});

export type IInvitationSchema = z.infer<typeof InvitationSchema>;
