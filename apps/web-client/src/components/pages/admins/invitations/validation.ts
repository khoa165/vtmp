import { z } from 'zod';

import { InvitationStatus } from '@vtmp/common/constants';

export const SendInvitationResponseSchema = z.object({
  data: z.object({
    receiverEmail: z.string(),
    sender: z.string(),
    token: z.string(),
    expiryDate: z.string(),
    status: z.nativeEnum(InvitationStatus, {
      message: 'Invalid invitation status',
    }),
  }),
});

export const InvitationSchema = z.object({
  _id: z.string(),
  receiverEmail: z.string().email({ message: 'Invalid email address' }),
  receiverName: z.string(),
  status: z.nativeEnum(InvitationStatus, {
    message: 'Invalid invitation status',
  }),
  expiryDate: z.string(),
});

export type IInvitationSchema = z.infer<typeof InvitationSchema>;
