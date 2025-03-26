import AuthService from '@/services/auth.service';
import { Request, Response } from 'express';

const AuthController = {
  /// PARSING, VALIDATING, RESPONSE
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Missing email or password' });
      }

      const token = await AuthService.login(req.body);
      res.status(200).json({ token });
    } catch (error: any) {
      const errorMessage = error?.message ?? 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default AuthController;
