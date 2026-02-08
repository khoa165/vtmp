import { consoleLogger, sentryLogger } from '@vtmp/observability/server';
import { Environment } from '@vtmp/server-common/constants';

export const Logger =
  process.env.NODE_ENV === Environment.TEST ||
  process.env.NODE_ENV === Environment.DEV
    ? consoleLogger
    : sentryLogger;
