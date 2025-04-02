import { EnvConfig } from '@/config/env';
import { UserRepository } from '@/repositories/user.repository';
import { ResourceNotFoundError, UnauthorizedError } from '@/utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '@/types/interface';

export const AuthService = {
  signup: async (accounts: IUser) => {
    // Check duplicate email
    const userByEmail = await UserRepository.findUserByEmail(accounts.email);

    if (userByEmail) {
      throw new Error('Duplicate Email');
    }

    // Create new user
    const newUser = await UserRepository.createUser(accounts);

    if (!newUser) {
      throw new Error('Too bad! You failed to sign up!');
    }

    return newUser;
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.findUserByEmail(email);
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

    const token = jwt.sign(
      { id: user._id.toString() },
      EnvConfig.get().JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    return token;
  },
};
