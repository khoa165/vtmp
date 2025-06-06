import { InvitationStatus } from '@vtmp/common/constants';
import { z } from 'zod';

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
