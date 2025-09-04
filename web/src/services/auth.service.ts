import { AuthType } from '@vtmp/server-common/constants';
import { JWTUtils, splitFirstAndLastName } from '@vtmp/server-common/utils';
import bcrypt from 'bcryptjs';
import { omit } from 'remeda';
import { z } from 'zod';

import { InvitationStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { JWT_TOKEN_TYPE } from '@/constants/enums';
import { IInvitation } from '@/models/invitation.model';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { InvitationService } from '@/services/invitation.service';
import { getEmailService } from '@/utils/email';
import {
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
  InternalServerError,
} from '@/utils/errors';

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
    password,
    invitationToken,
  }: {
    firstName: string;
    lastName: string;
    password: string;
    invitationToken: string;
  }) => {
    const invitation: IInvitation =
      await InvitationService.validateInvitation(invitationToken);

    const userByEmail = await UserRepository.getUserByEmail(
      invitation.receiverEmail
    );

    if (userByEmail) {
      throw new DuplicateResourceError(
        'Email is already taken, please sign up with a different email',
        {
          email: invitation.receiverEmail,
        }
      );
    }

    let existingUser;
    if (invitation.receiverName) {
      existingUser = await UserRepository.getUserByName(
        splitFirstAndLastName(invitation.receiverName)
      );
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    let user;
    if (existingUser) {
      user = await UserRepository.updateUserById(existingUser._id.toString(), {
        firstName,
        lastName,
        email: invitation.receiverEmail,
        encryptedPassword,
        activated: true,
      });
    } else {
      user = await UserRepository.createUser({
        firstName,
        lastName,
        email: invitation.receiverEmail,
        encryptedPassword,
      });
    }

    if (!user) {
      throw new InternalServerError('Unknown error creating or updating user', {
        firstName,
        lastName,
        email: invitation.receiverEmail,
        invitationName: invitation.receiverName,
      });
    }

    await InvitationRepository.updateInvitationById(invitation._id.toString(), {
      status: InvitationStatus.ACCEPTED,
    });

    const token = JWTUtils.createTokenWithPayload(
      { id: user._id.toString(), authType: AuthType.USER },
      EnvConfig.get().JWT_SECRET,
      {
        expiresIn: '2w',
      }
    );

    return {
      token,
      user: omit(user.toObject ? user.toObject() : user, ['encryptedPassword']),
    };
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

    await UserRepository.updateUserById(user._id.toString(), {
      encryptedPassword,
    });
  },
};
