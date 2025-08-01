import winston from 'winston';

import { BaseLogger } from '@/base/base-logger';

const consoleStructuredFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

export class ConsoleLogger implements BaseLogger {
  private static instance: ConsoleLogger | null = null;
  private winstonLogger: winston.Logger;

  private constructor() {
    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: consoleStructuredFormat,
      transports: [new winston.transports.Console()],
    });
  }

  public static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }
    return ConsoleLogger.instance;
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.winstonLogger.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.winstonLogger.warn(message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.winstonLogger.error(message, meta);
  }
}

export const consoleLogger = ConsoleLogger.getInstance();
