import dotenv from 'dotenv';
import { z } from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const migrationConfigSchema = z.object({
  MONGO_URI: z.string(),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({
      env: process.env,
      schema: migrationConfigSchema,
      workspaceName: 'mongo-migrations',
    }),
};
