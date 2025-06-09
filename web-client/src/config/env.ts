import { z } from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

const clientConfigSchema = z.object({
  VITE_STATSIG_CLIENT_SDK_KEY: z.string(),
  VITE_VTMP_2024_INTERVIEWS_CSV: z.string(),
  VITE_VTMP_2023_INTERVIEWS_CSV: z.string(),
  VITE_API_URL: z.string(),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({ env: import.meta.env, schema: clientConfigSchema }),
};
