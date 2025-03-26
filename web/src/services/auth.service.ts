import { getConfig } from '@/config/config';
import UserRepository from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const config = getConfig();

const AuthService = {
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
};

export default AuthService;
