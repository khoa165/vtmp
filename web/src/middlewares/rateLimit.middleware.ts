import rateLimit from 'express-rate-limit';
import { slowDown } from 'express-slow-down';
import { Request, Response } from 'express';

const rateLimitMiddleware = () => {
  if (process.env.NODE_ENV === 'test') {
    return [];
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
      handler: (_req: Request, res: Response) => {
        res.status(429).json({
          success: false,
          message: '⚠️ Too many requests, please try again later.',
        });
      },
    }),
  ];
};

export default rateLimitMiddleware;
