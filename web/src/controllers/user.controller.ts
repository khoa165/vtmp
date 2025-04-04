import { Request, Response } from 'express';
import UserService from '@/services/user.service';

const UserController = {
  login: async (req: Request, res: Response) => {
    try {
      const token = await UserService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    res.json(req.user);
  },

  createMock: async (_req: Request, res: Response) => {
    try {
      await UserService.createMock();
      res.status(201).json({ message: 'Mock users created' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
  getSingleUser: async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string | undefined;
      if (!userId) {
        throw new Error('User ID is required');
      }
      const user = await UserService.getSingleUser(userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default UserController;
