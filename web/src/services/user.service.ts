import UserRepository from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET ?? 'vtmp-secret',
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
