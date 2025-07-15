import { Environment } from '@vtmp/server-common/constants';
import dotenv from 'dotenv';
import { z } from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const sentryConfigSchema = z.object({
  SENTRY_DSN: z.string(),
  NODE_ENV: z.nativeEnum(Environment).optional().default(Environment.DEV),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({
      env: process.env,
      schema: sentryConfigSchema,
      workspaceName: 'observability',
    }),
};
