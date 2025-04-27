import { IUser, UserModel } from '@/models/user.model';

export const loadUsers = async (count: number): Promise<IUser[]> => {
  const newUsers = Array.from({ length: count }, (_, i) => ({
    firstName: `User${i}`,
    lastName: `Last${i}`,
    email: `abc-user${i}-vtmp@gmail.com`,
    encryptedPassword: 'password',
  }));

  const users = await UserModel.insertMany(newUsers);

  console.log(`Successfully seeded ${count} users.`);
  return users;
};
