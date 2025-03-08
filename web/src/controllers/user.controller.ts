import { Request, Response } from 'express';
import UserService from '@/services/user.service';

class UserController {
  static async login(req: Request, res: Response) {
    try {
      const token = await UserService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  }

  static async getProfile(req: Request, res: Response) {
    res.json(req.user);
  }
}

export default UserController;
