import AuthService from '@/services/auth.service';
import { handleError } from '@/utils/errors';
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
        return res.status(200).json({ data: { token } });
      } else {
        const { statusCode, errors } = handleError(validatedBody.error);
        return res.status(statusCode).json({ errors });
      }
    } catch (error: any) {
      const { statusCode, errors } = handleError(error);
      return res.status(statusCode).json({ errors });
    }
  },
};

export default AuthController;
