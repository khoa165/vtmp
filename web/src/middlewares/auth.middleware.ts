import { JWTUtils } from '@/utils/jwt';
import { Request, Response, NextFunction } from 'express';
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
    req.user = JWTUtils.decodeAndParseToken(token, DecodedJWTSchema);
    next();
  } catch {
    res.status(403).json({ message: 'Forbidden' });
  }
};
