import winston from 'winston';
import * as Transport from 'winston-transport';

export const consoleStructuredFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

export abstract class SentryLogger {
  protected logger: winston.Logger;

  constructor() {
    /// Default logger with no transports
    this.logger = winston.createLogger();
  }

  addTransport(transport: Transport) {
    this.logger.add(transport);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.logger.info(message, {
      ...meta,
    });
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.logger.warn(message, {
      ...meta,
    });
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.logger.error(message, {
      ...meta,
    });
  }
}
