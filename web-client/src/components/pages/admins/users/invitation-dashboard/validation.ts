import { InvitationStatus } from '@vtmp/common/constants';
import { z } from 'zod';

const InvitationSchema = z.object({
  receiverEmail: z.string().email({ message: 'Invalid email address' }),
  status: z.nativeEnum(InvitationStatus, {
    message: 'Invalid invitation status',
  }),
  expiryDate: z.string(),
});

export type IInvitationSchema = z.infer<typeof InvitationSchema>;
