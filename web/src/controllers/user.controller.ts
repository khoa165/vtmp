import { Request, Response } from 'express';

const UserController = {
  getProfile: async (req: Request, res: Response) => {
    console.log('Get to controller');
    res.status(200).json({ data: req.user });
    return;
  },
};

export default UserController;
