import dotenv from 'dotenv';
import { z } from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

import { Environment } from '@/constants/enums';

dotenv.config();

const webConfigSchema = z.object({
  MONGO_URI: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  JWT_SECRET: z.string(),
  SERVICE_JWT_SECRET: z.string(),
  SERVICE_NAME: z.string(),
  GMAIL_EMAIL: z.string(),
  GMAIL_APP_PASSWORD: z.string(),
  VTMP_WEB_URL: z.string(),
  SEED_ENV: z.nativeEnum(Environment).default(Environment.DEV),
  LINK_PROCESSING_ENDPOINT: z.string(),
  NODE_ENV: z.nativeEnum(Environment),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({
      env: process.env,
      schema: webConfigSchema,
      workspaceName: 'web',
    }),
};
