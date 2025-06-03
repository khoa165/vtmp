import { clientConfigSchema } from '@vtmp/common/constants';
import { parseEnvConfig } from '@vtmp/common/utils';

export const EnvConfig = {
  get: () =>
    parseEnvConfig({ env: import.meta.env, schema: clientConfigSchema }),
};
