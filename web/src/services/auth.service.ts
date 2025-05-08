import { UserRepository } from '@/repositories/user.repository';
import {
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
} from '@/utils/errors';
import { JWTUtils } from '@/utils/jwt';
import bcrypt from 'bcryptjs';
import { omit } from 'remeda';

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
      { id: user._id.toString() },
      {
        expiresIn: '1h',
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
      { id: user._id.toString() },
      {
        expiresIn: '1h',
      }
    );

    return { token, user: omit(user, ['encryptedPassword']) };
  },
};
