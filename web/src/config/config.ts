import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  MONGO_URI: z.string().url(),
});

export const getConfig = () => {
  return configSchema.parse(process.env);
};
