import { Environment } from '@/constants/enums';

export const MOCK_ENV = {
  PORT: 8000,
  MONGO_URI: 'mongodb://username:password@localhost:27017/database_name',
  JWT_SECRET: 'vtmp-secret',
  SERVICE_JWT_SECRET: 'vtmp-service-secret',
  SERVICE_NAME: 'web',
  GMAIL_EMAIL: 'vtmpwebsite2025@gmail.com',
  GMAIL_APP_PASSWORD: 'azpj ibvt glaf ebcy',
  VTMP_WEB_URL: 'viettechmentorship.com',
  SEED_ENV: Environment.DEV,
  LAMBDA_URL: 'https://lambda-url.on.aws',
  NODE_ENV: Environment.DEV,
};
