import UserService from '@/services/user.service';
import { UserRole } from '@common/enums';
import { ForbiddenError, ResourceNotFoundError } from '@/utils/errors';
import { Request, Response } from 'express';
import { z } from 'zod';
import { getUserFromRequest } from '@/middlewares/utils';

const UserUpdateSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .strict({ message: 'Unallowed fields to be updated!' })
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const UserUpdateRoleSchema = z
  .object({
    role: z.nativeEnum(UserRole, { message: 'Role is required' }),
  })
  .strict('Can only update role');

const UserIdSchema = z.object({
  userId: z.string(),
});

const UserController = {
  getAllUsers: async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ data: users });
    return;
  },

  getUser: async (req: Request, res: Response) => {
    const { userId } = UserIdSchema.parse(req.params);
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { userId });
    }

    res.status(200).json({ data: user });
    return;
  },

  updateUserProfile: async (req: Request, res: Response) => {
    const { userId } = UserIdSchema.parse(req.params);
    const userIdFromReq = getUserFromRequest(req).user.id;
    if (userId !== userIdFromReq) {
      throw new ForbiddenError('Cannot update other user information', {
        userId,
        userIdFromReq,
      });
    }

    const updateUserData = UserUpdateSchema.parse(req.body);
    const updatedUser = await UserService.updateUserById(
      userId,
      updateUserData
    );
    res.status(200).json({ data: updatedUser });
    return;
  },

  updateUserRole: async (req: Request, res: Response) => {
    const { userId } = UserIdSchema.parse(req.params);
    const { role } = UserUpdateRoleSchema.parse(req.body);

    const updatedUser = await UserService.updateUserById(userId, { role });
    res.status(200).json({ data: updatedUser });
    return;
  },
};

export default UserController;
