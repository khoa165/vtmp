import { faker } from '@faker-js/faker';
import { IUser, UserModel } from '@vtmp/mongo/models';
import bcrypt from 'bcryptjs';

import { SystemRole } from '@vtmp/common/constants';

const specificUsers = [
  {
    firstName: 'Khoa',
    lastName: 'Le',
    role: SystemRole.ADMIN,
  },
  {
    firstName: 'Dang',
    lastName: 'Son',
    role: SystemRole.USER,
  },
  {
    firstName: 'Quang',
    lastName: 'Minh',
    role: SystemRole.MODERATOR,
  },
  {
    firstName: 'Phuc',
    lastName: 'Jun',
    role: SystemRole.MODERATOR,
  },
  {
    firstName: 'An',
    lastName: 'Tran',
    role: SystemRole.USER,
  },
  {
    firstName: 'Nam',
    lastName: 'Nguyen',
    role: SystemRole.USER,
  },
  {
    firstName: 'Kha',
    lastName: 'Tran',
    role: SystemRole.USER,
  },
  {
    firstName: 'Monica',
    lastName: 'Huynh',
    role: SystemRole.ADMIN,
  },
  {
    firstName: 'Kevin',
    lastName: 'Doan',
    role: SystemRole.MODERATOR,
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
