import { Environment } from '@vtmp/server-common/constants';
import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { slowDown } from 'express-slow-down';

import { EnvConfig } from '@/config/env';
import { handleError } from '@/utils/errors';

export const rateLimitMiddleware = () => {
  if (EnvConfig.get().NODE_ENV === Environment.TEST) {
    return (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
  }
  return [
    slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 500,
      delayMs: () => 2000,
    }),

    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      handler: (
        _req: Request,
        res: Response,
        _next: NextFunction,
        err: unknown
      ) => {
        const { statusCode, errors } = handleError(err);
        res.status(statusCode).json({ errors });
        return;
      },
    }),
  ];
};
