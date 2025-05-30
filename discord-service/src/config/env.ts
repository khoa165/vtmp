import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  DISCORD_APPLICATION_ID: z.string(),
  DISCORD_PUBLIC_KEY: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  API_URL: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  LOGIN_EMAIL: z.string().email(),
  LOGIN_PASSWORD: z.string(),
});

export const EnvConfig = {
  get: () => {
    const envs = configSchema.safeParse(process.env);
    if (!envs.success) {
      throw new Error(
        'Environment variables for Discord service are not set correctly. Please check your .env file.'
      );
    }
    return envs.data;
  },
};
