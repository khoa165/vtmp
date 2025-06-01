import { z } from 'zod';
import { Environment } from './enums';

export const webConfigSchema = z.object({
  MONGO_URI: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  JWT_SECRET: z.string(),
  GMAIL_EMAIL: z.string(),
  GMAIL_APP_PASSWORD: z.string(),
  VTMP_WEB_URL: z.string(),
  SEED_ENV: z.nativeEnum(Environment).default(Environment.DEV),
});

export const discordConfigSchema = z.object({
  DISCORD_APPLICATION_ID: z.string(),
  DISCORD_PUBLIC_KEY: z.string(),
  DISCORD_BOT_TOKEN: z.string(),
  API_URL: z.string(),
  PORT: z.preprocess(Number, z.number().positive().finite()),
  LOGIN_EMAIL: z.string().email(),
  LOGIN_PASSWORD: z.string(),
});

export const clientConfigSchema = z.object({
  VITE_STATSIG_CLIENT_SDK_KEY: z.string(),
  VITE_VTMP_2024_INTERVIEWS_CSV: z.string(),
  VITE_VTMP_2023_INTERVIEWS_CSV: z.string(),
  VITE_API_URL: z.string(),
});
