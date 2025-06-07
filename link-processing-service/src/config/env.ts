import dotenv from 'dotenv';
import { z } from 'zod';
import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const linkProcessorConfigSchema = z.object({
  GOOGLE_GEMINI_API_KEY: z.string(),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({ env: process.env, schema: linkProcessorConfigSchema }),
};
