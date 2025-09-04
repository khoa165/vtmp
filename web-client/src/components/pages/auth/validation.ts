import { z } from 'zod';

import { SystemRole } from '@vtmp/common/constants';

export const AuthResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    user: z.object({
      _id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      role: z.nativeEnum(SystemRole, { message: 'Invalid user role' }),
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

export const RequestPasswordResetResponseSchema = z.object({
  data: z.object({
    reqPasswordReset: z.boolean(),
  }),
  message: z.string(),
});

export const ResetPasswordResponseSchema = z.object({
  data: z.object({
    reset: z.object({
      _id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    }),
  }),
  message: z.string(),
});
