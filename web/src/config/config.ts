import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  MONGO_URI: z.string().url(),
  PORT: z
    .string()
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num), { message: 'PORT must be a valid number' }),
  JWT_SECRET: z.string(),
});

export const getConfig = () => {
  return configSchema.parse(process.env);
};
