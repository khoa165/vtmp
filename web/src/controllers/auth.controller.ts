import AuthService from '@/services/auth.service';
import { Request, Response } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }),
});

const AuthController = {
  /// PARSING, VALIDATING, RESPONSE
  login: async (req: Request, res: Response) => {
    try {
      const validatedBody = loginSchema.safeParse(req.body);
      if (validatedBody.success) {
        const token = await AuthService.login(validatedBody.data);
        return res.status(200).json({ token });
      } else {
        return res
          .status(400)
          .json({ message: validatedBody.error.issues[0]?.message });
      }
    } catch (error: any) {
      const errorMessage = error?.message ?? 'An error occurred';
      return res.status(401).json({ message: errorMessage });
    }
  },
};

export default AuthController;
