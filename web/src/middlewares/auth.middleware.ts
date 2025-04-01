import { EnvConfig } from '@/config/env';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const DecodedJWTSchema = z.object({
  id: z.string(),
});

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, EnvConfig.get().JWT_SECRET);
    const parsed = DecodedJWTSchema.safeParse(decoded);
    if (parsed.success) {
      req.user = parsed.data;
    }

    next();
  } catch {
    res.status(403).json({ message: 'Forbidden' });
  }
};
