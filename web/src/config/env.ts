import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  MONGO_URI: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  JWT_SECRET: z.string(),
  GMAIL_EMAIL: z.string(),
  GMAIL_APP_PASSWORD: z.string(),
});

export const EnvConfig = {
  get: () => {
    const envs = configSchema.safeParse(process.env);
    if (!envs.success) {
      throw new Error(
        'Environment variables are not set correctly. Please check your .env file.'
      );
    }
    return envs.data;
  },
};
