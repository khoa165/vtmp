import { IUser, UserModel } from '@/models/user.model';
import bcrypt from 'bcryptjs';

export const loadUsers = async (count: number): Promise<IUser[]> => {
  const encryptedPassword = await bcrypt.hash('password', 10);
  const newUsers = Array.from({ length: count }, (_, i) => {
    const user = {
      firstName: `User${i}`,
      lastName: `Last${i}`,
      email: `abc-user${i}-vtmp@gmail.com`,
      encryptedPassword,
    };

    if (i === 0) {
      return { _id: '68110356bd157e78f5a2137e', ...user };
    } else {
      return user;
    }
  });

  const users = await UserModel.insertMany(newUsers);

  console.log(`Successfully seeded ${count} users.`);
  return users;
};
