import rateLimit from 'express-rate-limit';
import { slowDown } from 'express-slow-down';
import { NextFunction, Request, Response } from 'express';
import { handleError } from '@/utils/errors';

const rateLimitMiddleware = () => {
  if (process.env.NODE_ENV === 'test') {
    return (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
  }
  return [
    slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 1,
      delayMs: () => 2000,
    }),

    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
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

export default rateLimitMiddleware;
