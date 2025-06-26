import * as Sentry from '@sentry/node';

import { EnvConfig } from '@/config/env';

if (process.env.NODE_ENV !== 'test') {
  Sentry.init({
    dsn: EnvConfig.get().SENTRY_DSN,
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    _experiments: { enableLogs: true },
  });
}
