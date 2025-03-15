import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  MONGO_URI: z.string().url(),
PORT: z.preprocess(Number, z.number().positive().finite())
  JWT_SECRET: z.string(),
});

export const getConfig = () => {
  return configSchema.parse(process.env);
};
