import UserService from '@/services/user.service';
import { UserRole } from '@common/enums';
import { ForbiddenError, handleError } from '@/utils/errors';
import { Request, Response } from 'express';
import { z } from 'zod';

const UserUpdateSchema = z
  .object({
    firstName: z.string({ required_error: 'Firstname is required' }).optional(),
    lastName: z.string({ required_error: 'Lastname is required' }).optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' })
      .optional(),
  })
  .strict()
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter((value) => value !== undefined)
    )
  );

const UserUpdateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

const UserIdSchema = z.object({
  id: z.string(),
});

// TODO: dson - need to figure out how to remove "as AuthenticatedRequest"
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

const UserController = {
  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ data: users });
      return;
    } catch (err: unknown) {
      const { statusCode, errors } = handleError(err);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  getUser: async (req: Request, res: Response) => {
    try {
      const { id } = UserIdSchema.parse(req.params);
      const userIdFromReq = (req as AuthenticatedRequest).user.id;
      if (id !== userIdFromReq) {
        throw new ForbiddenError('Forbidden', { id, userIdFromReq });
      }

      const user = await UserService.getUserById(id);
      res.status(200).json({ data: user });
      return;
    } catch (err: unknown) {
      const { statusCode, errors } = handleError(err);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = UserIdSchema.parse(req.params);
      const userIdFromReq = (req as AuthenticatedRequest).user.id;
      if (id !== userIdFromReq) {
        throw new ForbiddenError('Forbidden', { id, userIdFromReq });
      }

      const updateUserData = UserUpdateSchema.parse(req.body);
      const updatedUser = await UserService.updateUserById(id, updateUserData);
      res.status(200).json({ data: updatedUser });
      return;
    } catch (err: unknown) {
      const { statusCode, errors } = handleError(err);
      res.status(statusCode).json({ errors });
      return;
    }
  },

  updateUserRole: async (req: Request, res: Response) => {
    try {
      const { id } = UserIdSchema.parse(req.params);
      const { role } = UserUpdateRoleSchema.parse(req.body);

      const updatedUser = await UserService.updateUserById(id, { role });
      res.status(200).json({ data: updatedUser });
      return;
    } catch (err: unknown) {
      const { statusCode, errors } = handleError(err);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};

export default UserController;
