import { handleError, UnauthorizedError } from '@/utils/errors';
import { EnvConfig } from '@/config/env';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import UserService from '@/services/user.service';

export const DecodedJWTSchema = z.object({
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
    const user = await UserService.getUserById(parsed.id);

    req.user = { id: String(user._id) };

    next();
  } catch (err: unknown) {
    const { statusCode, errors } = handleError(err);
    res.status(statusCode).json({ errors });
    return;
  }
};
