import { UserRepository } from '@/repositories/user.repository';
import { getEmailService } from '@/utils/email';
import {
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
} from '@/utils/errors';
import { JWTUtils } from '@vtmp/server-common/utils';
import bcrypt from 'bcryptjs';
import { omit } from 'remeda';
import { JWT_TOKEN_TYPE } from '@/constants/enums';
import { z } from 'zod';
import { EnvConfig } from '@/config/env';
import { AuthType } from '@vtmp/server-common/constants';

const ResetTokenPayloadSchema = z.object({
  id: z.string(),
  authType: z.nativeEnum(AuthType),
  email: z.string().email(),
  purpose: z.literal(JWT_TOKEN_TYPE.RESET_PASSWORD),
});

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

    const user = await UserRepository.createUser({
      firstName,
      lastName,
      email,
      encryptedPassword,
    });

    const token = JWTUtils.createTokenWithPayload(
      { id: user._id.toString(), authType: AuthType.USER },
      EnvConfig.get().JWT_SECRET,
      {
        expiresIn: '2w',
      }
    );

    return { token, user: omit(user.toObject(), ['encryptedPassword']) };
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
      { id: user._id.toString(), authType: AuthType.USER },
      EnvConfig.get().JWT_SECRET,
      {
        expiresIn: '2w',
      }
    );

    return { token, user: omit(user, ['encryptedPassword']) };
  },

  requestPasswordReset: async ({ email }: { email: string }) => {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { email });
    }

    const resetToken = JWTUtils.createTokenWithPayload(
      {
        id: user._id.toString(),
        authType: AuthType.USER,
        email: user.email,
        purpose: JWT_TOKEN_TYPE.RESET_PASSWORD,
      },
      EnvConfig.get().JWT_SECRET,
      {
        expiresIn: '10m',
      }
    );

    const emailService = getEmailService();
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
    const decoded = JWTUtils.verifyAndParseToken(
      token,
      ResetTokenPayloadSchema,
      EnvConfig.get().JWT_SECRET
    );

    const user = await UserRepository.getUserById(decoded.id, {
      includePasswordField: true,
    });

    if (!user) {
      throw new ResourceNotFoundError('User not found', {
        userId: decoded.id,
        context: 'resetPassword',
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.encryptedPassword
    );
    if (isSamePassword) {
      throw new DuplicateResourceError(
        'New password can not be similar as the old password.',
        {
          context: 'resetPassword',
          userId: user._id.toString(),
        }
      );
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await UserRepository.updateUserById(
      user._id.toString(),
      {
        encryptedPassword,
      }
    );

    return updatedUser;
  },
};
