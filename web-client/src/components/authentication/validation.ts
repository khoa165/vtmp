import { z } from 'zod';

export const AuthResponseSchema = z.object({
  data: z.object({
    token: z.string(),
  }),
});
