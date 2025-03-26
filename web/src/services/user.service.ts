import { getConfig } from '@/config/config';
import UserRepository from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const config = getConfig();

const UserService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    const passwordMatched = await bcrypt.compare(
      password,
      user.encryptedPassword ?? ''
    );
    if (!passwordMatched) {
      throw new Error('Wrong password');
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  },

  getProfile: async (userId: string) => {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

export default UserService;
