import dotenv from 'dotenv';
import { z } from 'zod';
import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const discordConfigSchema = z.object({
  DISCORD_APPLICATION_ID: z.string(),
  DISCORD_PUBLIC_KEY: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  API_URL: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  SERVICE_JWT_SECRET: z.string(),
  SERVICE_NAME: z.string(),
  AUDIENCE_SERVICE_NAME: z.string(),
});

export const EnvConfig = {
  get: () => parseEnvConfig({ env: process.env, schema: discordConfigSchema }),
};
