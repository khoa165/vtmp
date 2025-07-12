import { Request, Response } from 'express';
import { z } from 'zod';

import { SystemRole } from '@vtmp/common/constants';

import { UserService } from '@/services/user.service';

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
    role: z.nativeEnum(SystemRole, { message: 'Role is required' }),
  })
  .strict('Can only update role');

const UserIdSchema = z.object({
  userId: z.string(),
});

export const UserController = {
  getAllUsers: async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ data: users });
  },

  getUser: async (req: Request, res: Response) => {
    const { userId } = UserIdSchema.parse(req.params);
    const user = await UserService.getUserById(userId);
    res.status(200).json({ data: user });
  },

  updateUserProfile: async (req: Request, res: Response) => {
    const { userId } = UserIdSchema.parse(req.params);
    const updateUserData = UserUpdateSchema.parse(req.body);
    const updatedUser = await UserService.updateUserById(
      userId,
      updateUserData
    );
    res.status(200).json({ data: updatedUser });
  },

  updateUserRole: async (req: Request, res: Response) => {
    const { userId } = UserIdSchema.parse(req.params);
    const { role } = UserUpdateRoleSchema.parse(req.body);

    const updatedUser = await UserService.updateUserById(userId, { role });
    res.status(200).json({ data: updatedUser });
  },
};
