import { ForbiddenError, UnauthorizedError } from '@/utils/errors';
import { EnvConfig } from '@/config/env';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const DecodedJWTSchema = z.object({
  id: z.string({ required_error: 'Id is required' }),
});

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    const error = new UnauthorizedError('Unauthorized', {});
    const { statusCode, message } = error;

    res.status(statusCode).json({ message });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      EnvConfig.get().JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.log('Token verification failed:', err);
        } else {
          console.log('Decoded token:', decoded);
        }
      }
    );
    const parsed = DecodedJWTSchema.safeParse(decoded);

    if (parsed.success) {
      req.user = parsed.data;
    }

    next();
  } catch {
    const error = new ForbiddenError('Forbidden', {});
    const { statusCode, message } = error;

    res.status(statusCode).json({ message });
  }
};
