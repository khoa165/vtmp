import { UserRole } from '@vtmp/common/constants';
import { z } from 'zod';

export const AuthResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    user: z.object({
      _id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.nativeEnum(UserRole, { message: 'Invalid user role' }),
    }),
  }),
});

export const InvitationResponseSchema = z.object({
  data: z.object({
    receiverEmail: z.string().email(),
    sender: z.string(),
    token: z.string(),
  }),
});
