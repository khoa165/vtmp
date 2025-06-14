import { IUser, UserModel } from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { UserRole } from '@vtmp/common/constants';

const specificUsers = [
  {
    firstName: 'Khoa',
    lastName: 'Le',
    role: UserRole.ADMIN,
  },
  {
    firstName: 'Dang',
    lastName: 'Son',
    role: UserRole.USER,
  },
  {
    firstName: 'Quang',
    lastName: 'Minh',
    role: UserRole.MODERATOR,
  },
  {
    firstName: 'Phuc',
    lastName: 'Jun',
    role: UserRole.MODERATOR,
  },
  {
    firstName: 'An',
    lastName: 'Tran',
    role: UserRole.USER,
  },
  {
    firstName: 'Nam',
    lastName: 'Nguyen',
    role: UserRole.USER,
  },
  {
    firstName: 'Kha',
    lastName: 'Tran',
    role: UserRole.USER,
  },
  {
    firstName: 'Monica',
    lastName: 'Huynh',
    role: UserRole.ADMIN,
  },
  {
    firstName: 'Kevin',
    lastName: 'Doan',
    role: UserRole.MODERATOR,
  },
];

const getEmailFromName = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => `${firstName.toLowerCase()}.${lastName.toLowerCase()}@vtmp.com`;

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

  const allUsers = [
    ...newUsers,
    ...specificUsers.map((name) => ({
      ...name,
      email: getEmailFromName(name),
      encryptedPassword,
    })),
  ];

  const users = await UserModel.insertMany(allUsers);

  console.log(`Successfully seeded ${users.length} users.`);
  return users;
};
