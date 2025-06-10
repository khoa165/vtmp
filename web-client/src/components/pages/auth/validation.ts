import { SystemRole } from '@vtmp/common/constants';
import { z } from 'zod';

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
