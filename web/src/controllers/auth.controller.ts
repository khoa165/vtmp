import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { z } from 'zod';
import { BadRequestError } from '@/utils/errors';

const signupSchema = z
  .object({
    firstName: z.string({ required_error: 'Firstname is required' }),
    lastName: z.string({ required_error: 'Lastname is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be between 8 and 20 characters' })
      .max(20, { message: 'Password must be between 8 and 20 characters' })
      .superRefine((password, context) => {
        const containsUppercase = /[A-Z]/.test(password);

        if (!containsUppercase) {
          context.addIssue({
            code: 'custom',
            message: 'Password requires at least 1 uppercase letter',
          });
          return;
        }

        const containsLowercase = /[a-z]/.test(password);

        if (!containsLowercase) {
          context.addIssue({
            code: 'custom',
            message: 'Password requires at least 1 lowercase letter',
          });
          return;
        }

        const containsSpecialChar = /[`!@#$%^&?]/.test(password);

        if (!containsSpecialChar) {
          context.addIssue({
            code: 'custom',
            message:
              'Password requires at least 1 special character in [!, @, #, $, %, ^, &, ?]',
          });
          return;
        }

        const containsDigit = /[0-9]/.test(password);

        if (!containsDigit) {
          context.addIssue({
            code: 'custom',
            message: 'Password requires at least 1 digit',
          });
          return;
        }
      }),
  })
  .strict();

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }),
});

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required ' })
    .email({ message: 'Invalid email address ' }),
});

const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
  newPassword: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be between 8 and 20 characters' })
    .max(20, { message: 'Password must be between 8 and 20 characters' })
    .superRefine((password, context) => {
      const containsUppercase = /[A-Z]/.test(password);

      if (!containsUppercase) {
        context.addIssue({
          code: 'custom',
          message: 'Password requires at least 1 uppercase letter',
        });
        return;
      }

      const containsLowercase = /[a-z]/.test(password);

      if (!containsLowercase) {
        context.addIssue({
          code: 'custom',
          message: 'Password requires at least 1 lowercase letter',
        });
        return;
      }

      const containsSpecialChar = /[`!@#$%^&?]/.test(password);

      if (!containsSpecialChar) {
        context.addIssue({
          code: 'custom',
          message:
            'Password requires at least 1 special character in [!, @, #, $, %, ^, &, ?]',
        });
        return;
      }

      const containsDigit = /[0-9]/.test(password);

      if (!containsDigit) {
        context.addIssue({
          code: 'custom',
          message: 'Password requires at least 1 digit',
        });
        return;
      }
    }),
});

export const AuthController = {
  signup: async (req: Request, res: Response) => {
    const validatedBody = signupSchema.parse(req.body);
    const token = await AuthService.signup(validatedBody);
    res.status(200).json({ data: { token } });
  },

  login: async (req: Request, res: Response) => {
    const validatedBody = loginSchema.parse(req.body);
    const token = await AuthService.login(validatedBody);
    res.status(200).json({ data: { token } });
  },

  forgotPassword: async (req: Request, res: Response) => {
    const validatedBody = forgotPasswordSchema.parse(req.body);
    await AuthService.forgotPassword(validatedBody);
    res.status(200).json({
      data: {
        message:
          'If the account exists with this email, you will receive a password reset link via email',
      },
    });
  },

  resetPassword: async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
      throw new BadRequestError('Reset token is required');
    }
    const validatedBody = resetPasswordSchema.parse(req.body);
    await AuthService.resetPassword({ token, newPassword: validatedBody.newPassword});
    res.status(200).json({
      message: 'Password has been reset successfully',
    });
  },
};
