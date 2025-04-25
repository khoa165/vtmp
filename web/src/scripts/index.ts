import dotenv from 'dotenv';
import connectDB from '@/config/database';

dotenv.config();
import { UserRepository } from '@/repositories/user.repository';
connectDB();
const loadUsers = async (count: number) => {
  await Promise.all(
    Array.from({ length: count }, (_, i) => {
      const user = {
        firstName: `User${i}`,
        lastName: `Last${i}`,
        email: `abc-user${i}-vtmp@gmail.com`,
        encryptedPassword: 'password',
      };
      return UserRepository.createUser(user);
    })
  );
};

loadUsers(10);
