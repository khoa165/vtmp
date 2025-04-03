import { Request, Response } from 'express';

const UserController = {
  getProfile: async (req: Request, res: Response) => {
    res.json(req.user);
  },
};

export default UserController;
