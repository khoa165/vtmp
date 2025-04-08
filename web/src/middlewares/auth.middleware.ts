import { handleError, UnauthorizedError } from '@/utils/errors';
import { EnvConfig } from '@/config/env';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const DecodedJWTSchema = z.object({
  id: z.string({ required_error: 'Id is required' }),
});

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    if (!token) {
      throw new UnauthorizedError('Unauthorized', {});
    }

    const decoded = jwt.verify(token, EnvConfig.get().JWT_SECRET);

    const parsed = DecodedJWTSchema.parse(decoded);
    req.user = { id: parsed.id };

    next();
  } catch (err: unknown) {
    console.log(err);
    const { statusCode, errors } = handleError(err);
    res.status(statusCode).json({ errors });
    return;
  }
};
