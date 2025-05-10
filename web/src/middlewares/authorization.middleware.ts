import { Permission } from '@vtmp/common/constants';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@/utils/errors';
import { roleToPermissionMapping } from '@/constants/permissions';
import { getUserFromRequest } from '@/middlewares/utils';

export const hasPermission = (permission: Permission) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = getUserFromRequest(req).user;

    if (!roleToPermissionMapping[user.role].includes(permission)) {
      throw new ForbiddenError('Forbidden', { user });
    }
    next();
  };
};
