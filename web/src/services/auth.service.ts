import AuthRepository from '@/repositories/auth.repository';
import UserRepository from '@/repositories/user.repository';
import { Role, IUser } from '@/types/interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AuthService = {
  signup: async (accounts: IUser) => {
    const newUser = await UserRepository.create(accounts);

    if (!newUser) {
      throw new Error('Too bad! You failed to create new user!');
    }

    return newUser;
  },
};

export default AuthService;
