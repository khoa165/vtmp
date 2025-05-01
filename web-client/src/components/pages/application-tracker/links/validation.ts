import { z } from 'zod';

export const SubmitLinkResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    link: z.object({
      url: z.string(),
    }),
  }),
});
