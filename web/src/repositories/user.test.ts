import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import UserRepository from '@/repositories/user.repository';
import { useMongoDB } from '@/config/mongodb.test';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();

  it('should be able to find user by id', async () => {
    const mockUser = {
      name: 'admin',
      email: 'test@example.com',
      password: 'password',
    };
    const newlyCreatedRecord = await UserRepository.create(mockUser);
    const user = await UserRepository.findById(newlyCreatedRecord.id);

    expect(user).to.containSubset(mockUser);
  });

  it('should be able to find user by email', async () => {
    const mockUser = {
      name: 'admin',
      email: 'test@example.com',
      password: 'password',
    };
    await UserRepository.create(mockUser);
    const user = await UserRepository.findByEmail('test@example.com');

    expect(user).to.containSubset(mockUser);
  });
});
