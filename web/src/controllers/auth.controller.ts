import { Request, Response } from 'express';
import AuthenticationService from '@/services/auth.service';

const AuthController = {
  signup: async (req: Request, res: Response) => {
    try {
      // Call the authentication service - signup
      const token = await AuthenticationService.signup(req.body);

      //   Return the response
      res.status(200).json({ token });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default AuthController;
