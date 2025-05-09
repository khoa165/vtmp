import { JWTUtils } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import UserService from '@/services/user.service';

export const DecodedJWTSchema = z.object({
  id: z.string({ required_error: 'Id is required' }),
});

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Unauthorized', {});
  }

  const parsed = JWTUtils.decodeAndParseToken(token, DecodedJWTSchema);
  const user = await UserService.getUserById(parsed.id);

  req.user = { id: String(user._id) };

  next();
};
