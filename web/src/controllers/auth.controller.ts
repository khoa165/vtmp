import { Request, Response } from 'express';
import AuthService from '@/services/auth.service';
import { Role } from '@/types/interface';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string({ required_error: 'Firstname is required' }),
  lastName: z.string({ required_error: 'Lastname is required' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  encryptedPassword: z.string({ required_error: 'Password is required' }),
  role: z.nativeEnum(Role, { required_error: 'Role is required' }),
});

const AuthController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, encryptedPassword, role } = req.body;

      // Validate all the fields are required
      const validatedBody = signupSchema.safeParse(req.body);
      if (validatedBody.success) {
        // Call the authentication service - signup
        const token = await AuthService.signup({
          firstName,
          lastName,
          email,
          encryptedPassword,
          role,
        });

        // Return the response
        res.status(200).json({ token });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default AuthController;
