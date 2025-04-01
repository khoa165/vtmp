import { AuthService } from '@/services/auth.service';
import { handleError } from '@/utils/errors';
import { Request, Response } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }),
});

export const AuthController = {
  login: async (req: Request, res: Response) => {
    try {
      const validatedBody = loginSchema.safeParse(req.body);

      if (!validatedBody.success) {
        throw validatedBody.error;
      }

      const token = await AuthService.login(validatedBody.data);
      res.status(200).json({ data: { token } });
      return;
    } catch (error: unknown) {
      const { statusCode, errors } = handleError(error);
      res.status(statusCode).json({ errors });
      return;
    }
  },
};
