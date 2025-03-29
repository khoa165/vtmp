import AuthRepository from '@/repositories/auth.repository';
import UserRepository from '@/repositories/user.repository';
import { Role, IUser } from '@/types/interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AuthService = {
  signup: async (accounts: IUser) => {
    // Check duplicate email
    const userByEmail = await UserRepository.findByEmail(accounts.email);

    if (userByEmail) {
      throw new Error('Duplicate Email');
    }

    // Create new user
    const newUser = await UserRepository.create(accounts);

    if (!newUser) {
      throw new Error('Too bad! You failed to sign up!');
    }

    return newUser;
  },
};

export default AuthService;
