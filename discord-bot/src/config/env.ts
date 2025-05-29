import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_GUILD_ID: z.string(),
  API_URL: z.string(),
});

export const EnvConfig = {
  get: () => {
    const envs = configSchema.safeParse(process.env);
    if (!envs.success) {
      throw new Error(
        'Environment variables for Discord bot are not set correctly. Please check your .env file.'
      );
    }
    return envs.data;
  },
};
