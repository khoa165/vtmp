import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  MONGO_URI: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  JWT_SECRET: z.string(),
});

export const EnvConfig = {
  get: () => {
    const envs = configSchema.safeParse(process.env);
    envs.success
      ? console.log('✅ Environment variables loaded successfully')
      : console.error(
          '❌ Environment variables loading failed:',
          envs.error.flatten()
        );
    return (
      envs.data ?? {
        MONGO_URI: '',
        PORT: 5000,
        JWT_SECRET: '',
      }
    );
  },
};
