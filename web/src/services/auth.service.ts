import { UserRepository } from '@/repositories/user.repository';
import { EmailService } from '@/utils/email';
import {
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
} from '@/utils/errors';
import { JWTUtils } from '@/utils/jwt';
import bcrypt from 'bcryptjs';

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

  requestPasswordReset: async ({ email }: { email: string }) => {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { email });
    }

    const resetToken = JWTUtils.createTokenWithPayload(
      { 
        id: user._id.toString(),
        purpose: 'password_reset' 
      },
      {
        expiresIn: '10m',
      }
    );
    
    console.log(`Password reset token for ${email}: ${resetToken}`);

    const emailService = new EmailService();
    const emailTemplate = emailService.getPasswordResetTemplate(
      `${user.firstName} ${user.lastName}`,
      user.email,
      resetToken
    );
    await emailService.sendEmail(emailTemplate);
  },

  resetPassword: async ({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) => {

    type ResetTokenPayload = {
      id: string;
      purpose: string;
      exp: number;
    };

    const decoded = JWTUtils.decodeAndParseToken<ResetTokenPayload>(
      token, 
      {
        parse: (data: unknown) => {
          const payload = data as ResetTokenPayload;
          return {
            id: payload.id,
            purpose: payload.purpose || '',
            exp: payload.exp || 0,
          }
        }
      }
    );

    if (decoded.purpose !== 'password_reset') {
      throw new UnauthorizedError('Invalid token type for password reset', {
        context: 'resetPassword',
        tokenType: decoded.purpose
      });
    }

    if (Date.now() >= decoded.exp*1000) {
      throw new UnauthorizedError('Token expired', { token })
    }

    const user = await UserRepository.getUserById(decoded.id, {
      includePasswordField: true,
    });

    if (!user) {
      throw new ResourceNotFoundError('User not found', {
        userId: decoded.id,
        context: 'resetPassword'
      });
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    await UserRepository.updateUserById(user._id.toString(), {
      encryptedPassword,
      passwordChangedAt: new Date(),
    });

    return { success: true };
  },
};
