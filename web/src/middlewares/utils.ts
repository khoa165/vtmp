import { Request } from 'express';
import { UserRole } from '@/types/enums';
import { UnauthorizedError } from '@/utils/errors';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}

export const getUserFromRequest = (req: Request): AuthenticatedRequest => {
  if (!req.user) {
    throw new UnauthorizedError('User is not authenticated', {});
  }
  return req as AuthenticatedRequest;
};
