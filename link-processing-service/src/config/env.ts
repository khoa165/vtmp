import dotenv from 'dotenv';
import { z } from 'zod';
import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const linkProcessorConfigSchema = z.object({
  GOOGLE_GEMINI_API_KEY: z.string(),
  API_URL: z.string(),
  LOGIN_EMAIL: z.string(),
  LOGIN_PASSWORD: z.string(),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({ env: process.env, schema: linkProcessorConfigSchema }),
};
