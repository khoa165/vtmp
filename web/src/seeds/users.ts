import { UserRepository } from '@/repositories/user.repository';

export const loadUsers = async (count: number) => {
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
