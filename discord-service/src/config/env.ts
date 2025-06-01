import dotenv from 'dotenv';
import { discordConfigSchema } from '@vtmp/common/constants';
import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

export const EnvConfig = {
  get: () => parseEnvConfig({ env: process.env, schema: discordConfigSchema }),
};
