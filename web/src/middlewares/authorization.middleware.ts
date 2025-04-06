import { handleError, UnauthorizedError } from '@/utils/errors';
import { Permission } from '@/types/enums';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@/utils/errors';
import { roleToPermissionMapping } from '@/constants/permissions';

export const hasPermission = (permission: Permission) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = req.user;

    try {
      if (!user) {
        throw new UnauthorizedError('Unauthorized', {});
      }

      if (!roleToPermissionMapping[user.role].includes(permission)) {
        throw new ForbiddenError('Forbidden', { user });
      }
      next();
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  };
};
