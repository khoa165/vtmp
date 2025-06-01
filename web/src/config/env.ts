import dotenv from 'dotenv';
import { parseEnvConfig } from '@vtmp/common/utils';
import { webConfigSchema } from '@vtmp/common/constants';

dotenv.config();

export const EnvConfig = {
  get: () => parseEnvConfig({ env: process.env, schema: webConfigSchema }),
};
