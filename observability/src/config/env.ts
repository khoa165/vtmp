import dotenv from 'dotenv';
import { z } from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const sentryConfigSchema = z.object({
  SENTRY_DSN: z.string(),
});

export const EnvConfig = {
  get: () => parseEnvConfig({ env: process.env, schema: sentryConfigSchema }),
};
