import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import winston from 'winston';
import Transport from 'winston-transport';

import { SystemRole } from '@vtmp/common/constants';

import { BaseLogger } from '@/base/base-logger';

dotenv.config();
Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  environment: process.env.NODE_ENV || 'PROD',
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  _experiments: { enableLogs: true },
});

export class SentryLogger implements BaseLogger {
  private static instance: SentryLogger | null = null;
  private winstonLogger: winston.Logger;

  private constructor() {
    const SentryWithWinstonTransport =
      Sentry.createSentryWinstonTransport(Transport);

    this.winstonLogger = winston.createLogger({
      level: 'info',
      transports: [new SentryWithWinstonTransport()],
    });
  }

  public static getInstance(): SentryLogger {
    if (!SentryLogger.instance) {
      SentryLogger.instance = new SentryLogger();
    }
    return SentryLogger.instance;
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    /// This goes to Sentry Issues tab
    Sentry.captureException(message, {
      ...meta,
    });
    /// This goes to Sentry Logs tab
    this.winstonLogger.info(message, {
      ...meta,
    });
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    Sentry.captureException(message, {
      ...meta,
    });
    this.winstonLogger.warn(message, {
      ...meta,
    });
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    Sentry.captureException(message, {
      ...meta,
    });
    this.winstonLogger.error(message, {
      ...meta,
    });
  }

  public setUser(user: { id: string; email: string; role: SystemRole }): void {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
}

export const sentryLogger = SentryLogger.getInstance();
