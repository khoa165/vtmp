import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import UserRepository from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();

  it('should be able to find user by id', async () => {
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    };
    const newlyCreatedRecord = await UserRepository.create(mockUser);
    const user = await UserRepository.findById(newlyCreatedRecord.id);

    expect(user).to.containSubset(mockUser);
  });

  it('should be able to find user by email', async () => {
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@example.com',
      encryptedPassword: 'ecnrypted-password-later',
    };
    await UserRepository.create(mockUser);
    const user = await UserRepository.findByEmail('test@example.com');

    expect(user).to.containSubset(mockUser);
  });
});
