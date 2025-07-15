import * as Sentry from '@sentry/node';
import { Environment } from '@vtmp/server-common/constants';

import { EnvConfig } from '@/config/env';

if (EnvConfig.get().NODE_ENV !== Environment.TEST) {
  Sentry.init({
    dsn: EnvConfig.get().SENTRY_DSN,
    sendDefaultPii: true,
    environment: EnvConfig.get().NODE_ENV,
    tracesSampleRate: 1.0,
    _experiments: { enableLogs: true },
  });
}
