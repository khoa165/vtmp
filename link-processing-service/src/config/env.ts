import dotenv from 'dotenv';
import { z } from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const linkProcessorConfigSchema = z.object({
  GOOGLE_GEMINI_API_KEY: z.string(),
  GOOGLE_SAFE_BROWSING_API_KEY: z.string(),
  API_URL: z.string(),
  SERVICE_JWT_SECRET: z.string(),
  SERVICE_NAME: z.string(),
  AUDIENCE_SERVICE_NAME: z.string(),
  NODE_ENV: z.string(),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({ env: process.env, schema: linkProcessorConfigSchema }),
};
