import { ForbiddenError, handleError, UnauthorizedError } from '@/utils/errors';
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
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    const error = new UnauthorizedError('Unauthorized', {});
    const { statusCode, errors } = handleError(error);
    res.status(statusCode).json({ errors });
    return;
  }

  try {
    const decoded = jwt.verify(token, EnvConfig.get().JWT_SECRET);

    const parsed = DecodedJWTSchema.parse(decoded);
    req.user = { id: parsed.id };

    next();
  } catch {
    const error = new ForbiddenError('Forbidden', {});
    const { statusCode, errors } = handleError(error);
    res.status(statusCode).json({ errors });
    return;
  }
};
