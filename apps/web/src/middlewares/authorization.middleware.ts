import { Permission } from '@vtmp/common/constants';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@/utils/errors';
import { roleToPermissionMapping } from '@/constants/permissions';
import { getServiceFromRequest, getUserFromRequest } from '@/middlewares/utils';

export const hasPermission = (permission: Permission) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.user) {
      const user = getUserFromRequest(req).user;

      if (!roleToPermissionMapping[user.role].includes(permission)) {
        throw new ForbiddenError('Forbidden', { user, permission });
      }
      return next();
    }

    if (req.service) {
      const service = getServiceFromRequest(req).service;
      if (!roleToPermissionMapping[service.role].includes(permission)) {
        throw new ForbiddenError('Forbidden', { service, permission });
      }
      return next();
    }

    throw new ForbiddenError('Forbidden: No user or service found', {});
  };
};
