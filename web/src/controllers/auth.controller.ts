import { Request, Response } from 'express';
import { z } from 'zod';

import { AuthService } from '@/services/auth.service';
import { InvitationService } from '@/services/invitation.service';

const PasswordSchema = z
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
  });

const SignupSchema = z
  .object({
    firstName: z.string({ required_error: 'Firstname is required' }),
    lastName: z.string({ required_error: 'Lastname is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: PasswordSchema,
    token: z.string({ required_error: 'An invitation token is required' }),
  })
  .strict();

const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }),
});

const RequestPasswordResetSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

const ResetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
  newPassword: PasswordSchema,
});

export const AuthController = {
  signup: async (req: Request, res: Response) => {
    const validatedBody = SignupSchema.parse(req.body);
    await InvitationService.validateInvitation(validatedBody.token);
    const { token, user } = await AuthService.signup(validatedBody);
    res.status(200).json({ data: { token, user } });
  },

  login: async (req: Request, res: Response) => {
    const validatedBody = LoginSchema.parse(req.body);
    const { token, user } = await AuthService.login(validatedBody);

    res.status(200).json({ data: { token, user } });
  },

  requestPasswordReset: async (req: Request, res: Response) => {
    const validatedBody = RequestPasswordResetSchema.parse(req.body);
    const reqPasswordReset =
      await AuthService.requestPasswordReset(validatedBody);
    res.status(200).json({
      data: { reqPasswordReset },
      message:
        'If the account exists with this email, you will receive a password reset link via email',
    });
  },

  resetPassword: async (req: Request, res: Response) => {
    const { token, newPassword } = ResetPasswordSchema.parse(req.body);
    const reset = await AuthService.resetPassword({ token, newPassword });
    res.status(200).json({
      data: { reset },
      message: 'Password has been reset successfully',
    });
  },
};
