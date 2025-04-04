import { handleError } from "@/utils/errors";
import { Permission, Role } from "@/types/enums";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "@/repositories/user.repository";
import { UnauthorizedError, ResourceNotFoundError, ForbiddenError } from "@/utils/errors";
import { roleToPermissionMapping } from "@/constants/permissions";

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

    if (user.role != Role.USER && roleToPermissionMapping[user.role].includes(permission)) {
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
