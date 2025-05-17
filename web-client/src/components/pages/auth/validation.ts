import { z } from 'zod';

export const AuthResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: z.object({
      _id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
    }),
  }),
});
