import { EnvConfig } from '@/config/env';
import UserRepository from '@/repositories/user.repository';
import { ResourceNotFoundError, UnauthorizedError } from '@/utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AuthService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new ResourceNotFoundError('User not found', { email });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.encryptedPassword ?? ''
    );
    if (!passwordMatched) {
      throw new UnauthorizedError('Wrong password', {
        email,
        password,
      });
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

export default AuthService;
