import { Role } from '@/models/user.model';
import { UserRepository } from '@/repositories/user.repository';
import {
  ForbiddenError,
  handleError,
  ResourceNotFoundError,
  UnauthorizedError,
} from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';

enum Permission {
  GET_ALL_PENDING_JOB_LINK = 'GET_ALL_PENDING_JOB_LINK',
  APPROVE_JOB_LINK = 'APPROVE_JOB_LINK ',
  REJECT_JOB_LINK = 'REJECT_JOB_LINK',
  UPDATE_JOB_POSTING = 'UPDATE_JOB_POSTING',
  DELETE_JOB_POSTING = 'DELETE_JOB_POSTING',
  GET_ALL_INVITATIONS = 'GET_ALL_INVITATIONS',
  CREATE_INVITATION = 'CREATE_INVITATION',
  REVOKE_INVITATION = 'REVOKE_INVITATION',
  CREATE_APPLICATION = 'CREATE_APPLICATION',
  UPDATE_APPLICATION = 'UPDATE_APPLICATION',
}

// Mapping Role with Permission
export const rolePermissionMapping = {
  [Role.ADMIN]: [
    Permission.GET_ALL_PENDING_JOB_LINK,
    Permission.APPROVE_JOB_LINK,
    Permission.REJECT_JOB_LINK,
    Permission.UPDATE_JOB_POSTING,
    Permission.DELETE_JOB_POSTING,
    Permission.GET_ALL_INVITATIONS,
    Permission.CREATE_INVITATION,
    Permission.REVOKE_INVITATION,
  ],
  [Role.MODERATOR]: [
    Permission.GET_ALL_PENDING_JOB_LINK,
    Permission.APPROVE_JOB_LINK,
    Permission.REJECT_JOB_LINK,
    Permission.UPDATE_JOB_POSTING,
    Permission.DELETE_JOB_POSTING,
  ],
  [Role.USER]: [Permission.CREATE_APPLICATION, Permission.UPDATE_APPLICATION],
};

export const hasPermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req?.user) {
      return handleError(new UnauthorizedError('Unauthorized', {}));
    }

    const { id } = req.user;
    const user = await UserRepository.findUserById(id);
    if (!user) {
      const { statusCode, errors } = handleError(
        new ResourceNotFoundError('User not found', { id })
      );
      res.status(statusCode).json({ errors });
      return;
    }

    if (rolePermissionMapping[user.role].includes(permission)) {
      next();
      return;
    } else {
      const { statusCode, errors } = handleError(
        new ForbiddenError('Forbidden', { user })
      );
      res.status(statusCode).json({ errors });
      return;
    }
  };
};
