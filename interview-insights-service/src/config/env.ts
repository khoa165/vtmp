import dotenv from 'dotenv';
import z from 'zod';

import { parseEnvConfig } from '@vtmp/common/utils';

dotenv.config();

const InterviewInsightConfigSchema = z.object({
  AUDIENCE_SERVICE_NAME: z.string(),
  API_URL: z.string(),
  SERVICE_JWT_SECRET: z.string(),
  SERVICE_NAME: z.string(),
  NODE_ENV: z.string(),
  GOOGLE_GEMINI_API_KEY: z.string(),
});

export const EnvConfig = {
  get: () =>
    parseEnvConfig({
      env: process.env,
      schema: InterviewInsightConfigSchema,
      workspaceName: 'interview-insights-service',
    }),
};
