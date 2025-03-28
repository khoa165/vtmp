import AuthService from '@/services/auth.service';
import { Request, Response } from 'express';

const AuthController = {
  /// PARSING, VALIDATING, RESPONSE
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      const token = await AuthService.login(req.body);
      return res.status(200).json({ token });
    } catch (error: any) {
      const errorMessage = error?.message ?? 'An error occurred';
      return res.status(401).json({ message: errorMessage });
    }
  },
};

export default AuthController;
