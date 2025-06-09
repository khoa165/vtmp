import { z } from 'zod';

import { UserRole } from '@vtmp/common/constants';

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
