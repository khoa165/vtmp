import { EnvConfig } from '@/config/env';
import { UserRepository } from '@/repositories/user.repository';
import { handleError, ResourceNotFoundError } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const DecodedJWTSchema = z.object({
  id: z.string(),
});

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, EnvConfig.get().JWT_SECRET);
    const parsed = DecodedJWTSchema.safeParse(decoded);
    if (!parsed.success) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const { id } = parsed.data;
    const user = await UserRepository.findUserById(id);
    if (!user) {
      const { statusCode, errors } = handleError(
        new ResourceNotFoundError('User not found', { id })
      );
      res.status(statusCode).json({ errors });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
};
