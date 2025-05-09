import { UserRepository } from '@/repositories/user.repository';
import { EmailService } from '@/utils/email';
import {
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
  BadRequestError,
  InternalServerError,
} from '@/utils/errors';
import { JWTUtils } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const AuthService = {
  signup: async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const userByEmail = await UserRepository.getUserByEmail(email);

    if (userByEmail) {
      throw new DuplicateResourceError(
        'Email is already taken, please sign up with a different email',
        {
          email,
        }
      );
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    return UserRepository.createUser({
      firstName,
      lastName,
      email,
      encryptedPassword,
    });
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.getUserByEmail(email, {
      includePasswordField: true,
    });
    if (!user) {
      throw new ResourceNotFoundError('User not found', { email });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!passwordMatched) {
      throw new UnauthorizedError('Wrong password', { email });
    }

    const token = JWTUtils.createTokenWithPayload(
      { id: user._id.toString() },
      {
        expiresIn: '1h',
      }
    );
    return token;
  },

  forgotPassword: async ({ email }: { email: string }) => {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { email });
    }

    if (user.resetTokenExpiry && user.resetToken && user.resetTokenExpiry > new Date()) {
      await UserRepository.updateUserById(user._id.toString(), {
        resetToken: undefined,
        resetTokenExpiry: undefined,
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiredTime = new Date(Date.now() + 10 * 60 * 1000);

    console.log(`Password reset token for ${email}: ${token}`);

    try {
      await UserRepository.updateUserById(user._id.toString(), {
        resetToken: hashedToken,
        resetTokenExpiry: expiredTime,
      });

      // send email with reset link
      const emailService = new EmailService();
      const emailTemplate = emailService.getPasswordResetTemplate(
        `${user.firstName} ${user.lastName}`,
        user.email,
        token
      );
      await emailService.sendEmail(emailTemplate);
    } catch (error) {
      await UserRepository.updateUserById(user._id.toString(), {
        resetToken: undefined,
        resetTokenExpiry: undefined,
      });
      throw new InternalServerError('Failed to send password reset email', { error });
    }
  },

  resetPassword: async ({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserRepository.getUserByEmail('', {
      includePasswordField: true,
      resetToken: hashedToken,
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestError('Invalid or expired token');
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    await UserRepository.updateUserById(user._id.toString(), {
      encryptedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
  },
};
