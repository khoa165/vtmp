import { IUser, UserModel } from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const loadUsers = async (count: number): Promise<IUser[]> => {
  const encryptedPassword = await bcrypt.hash('password', 10);
  const newUsers = Array.from({ length: count - 1 }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    return {
      firstName,
      lastName,
      email,
      encryptedPassword,
    };
  });

  const user0 = {
    _id: '68110356bd157e78f5a2137e',
    firstName: 'Khoa',
    lastName: 'Le',
    email: 'khoale@vtmp.com',
    encryptedPassword,
  };

  const allUsers = [...newUsers, user0];

  const users = await UserModel.insertMany(allUsers);

  console.log(`Successfully seeded ${count} users.`);
  return users;
};
