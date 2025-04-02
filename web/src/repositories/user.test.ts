import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import { UserRepository } from '@/repositories/user.repository';
import { IUser, Role } from '@/types/interface';
import { useMongoDB } from '@/testutils/mongoDB.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();

  it('should be able to find user by id', async () => {
    const mockUser: IUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@example.com',
      encryptedPassword: 'ecnrypted-password-later',
      role: Role.ADMIN,
    };
    const newlyCreatedRecord = await UserRepository.createUser(mockUser);
    const user = await UserRepository.findUserById(newlyCreatedRecord.id);

    expect(user).to.containSubset(mockUser);
  });

  it('should be able to find user by email', async () => {
    const mockUser: IUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@example.com',
      encryptedPassword: 'ecnrypted-password-later',
      role: Role.ADMIN,
    };
    await UserRepository.createUser(mockUser);
    const user = await UserRepository.findUserByEmail('test@example.com');

    expect(user).to.containSubset(mockUser);
  });
});
