import { Request, Response, NextFunction } from 'express';

import { roleToPermissionMapping } from '@/constants/permissions';
import { getUserFromRequest } from '@/middlewares/utils';
import { ForbiddenError } from '@/utils/errors';
import { Permission } from '@vtmp/common/constants';

export const hasPermission = (permission: Permission) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = getUserFromRequest(req).user;

    if (!roleToPermissionMapping[user.role].includes(permission)) {
      throw new ForbiddenError('Forbidden', { user, permission });
    }
    next();
  };
};
