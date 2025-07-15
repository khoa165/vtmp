import * as Sentry from '@sentry/node';
import { Environment } from '@vtmp/server-common/constants';
import winston from 'winston';
import Transport from 'winston-transport';

import { consoleStructuredFormat, SentryLogger } from '@/base/sentry-logger';
import { EnvConfig } from '@/config/env';

const SentryWithWinstonTransport =
  Sentry.createSentryWinstonTransport(Transport);

export class ServerLogger extends SentryLogger {
  constructor() {
    super();
    const env = EnvConfig.get().NODE_ENV;

    if (env === Environment.DEV) {
      this.addTransport(
        new winston.transports.Console({
          format: consoleStructuredFormat,
        })
      );
    }

    // Always add Sentry transport for error reporting
    this.addTransport(new SentryWithWinstonTransport());
  }
}

let serverLogger: ServerLogger | null = null;

export const getServerLogger = (): ServerLogger => {
  if (!serverLogger) {
    serverLogger = new ServerLogger();
  }

  return serverLogger;
};
