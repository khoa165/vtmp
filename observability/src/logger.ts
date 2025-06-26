import * as Sentry from '@sentry/node';
import winston from 'winston';
import Transport from 'winston-transport';

const SentryWithWinstonTransport =
  Sentry.createSentryWinstonTransport(Transport);

export const logger = winston.createLogger({
  transports: [
    // Console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    }),
    // Sentry transport for error reporting
    new SentryWithWinstonTransport(),
  ],
});
