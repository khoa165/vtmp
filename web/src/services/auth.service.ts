import { getConfig } from '@/config/config';
import UserRepository from '@/repositories/user.repository';
import { ResourceNotFoundError, UnauthorizedError } from '@/utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// const config = getConfig();

const AuthService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new ResourceNotFoundError('User not found', {});
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.encryptedPassword ?? ''
    );
    if (!passwordMatched) {
      throw new UnauthorizedError('Wrong password', {});
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET ?? 'vtmp-secret',
      {
        expiresIn: '1h',
      }
    );
    return token;
  },
};

export default AuthService;
