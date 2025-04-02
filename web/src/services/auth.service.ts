import { EnvConfig } from '@/config/env';
import { UserRepository } from '@/repositories/user.repository';
import { ResourceNotFoundError, UnauthorizedError } from '@/utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@/models/user.model';

export const AuthService = {
  signup: async (accounts: {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    role: Role;
  }) => {
    // Check duplicate email
    const userByEmail = await UserRepository.findUserByEmail(accounts.email);

    if (userByEmail) {
      throw new Error('Duplicate Email');
    }

    const saltRounds = 10; // The number of rounds to use for salt generation

    // Encrypt password
    accounts.encryptedPassword = await bcrypt.hash(
      accounts.encryptedPassword,
      saltRounds
    );

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
