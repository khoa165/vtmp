import { IUser, UserModel } from '@/models/user.model';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const specificUsers = [
  {
    firstName: 'Khoa',
    lastName: 'Le',
  },
  {
    firstName: 'Dang',
    lastName: 'Son',
  },
  {
    firstName: 'Quang',
    lastName: 'Minh',
  },
  {
    firstName: 'Phuc',
    lastName: 'Jun',
  },
  {
    firstName: 'An',
    lastName: 'Tran',
  },
  {
    firstName: 'Nam',
    lastName: 'Nguyen',
  },
  {
    firstName: 'Kha',
    lastName: 'Tran',
  },
  {
    firstName: 'Monica',
    lastName: 'Huynh',
  },
  {
    firstName: 'Kevin',
    lastName: 'Doan',
  }
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
