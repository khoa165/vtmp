import { EnvConfig } from '@/config/env';
import { UserRepository } from '@/repositories/user.repository';
import {
  DuplicateResourceError,
  UnauthorizedError,
  ResourceNotFoundError,
} from '@/utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@/models/user.model';

export const AuthService = {
  signup: async ({
    firstName,
    lastName,
    email,
    password,
    role,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    // Check duplicate email
    const userByEmail = await UserRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new DuplicateResourceError('Duplicate Email', {
        email,
      });
    }

    const saltRounds = 10; // The number of rounds to use for salt generation

    // Encrypt password
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await UserRepository.createUser({
      firstName,
      lastName,
      email,
      encryptedPassword,
      role,
    });

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
