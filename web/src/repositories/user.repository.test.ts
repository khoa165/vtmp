import * as chai from 'chai';
import chaiSubset from 'chai-subset';

import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();

  describe('createUser', () => {
    it('should create an user', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };

      const user = await UserRepository.createUser(mockUser);

      expect(user).to.containSubset(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should be able to find user by id', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newlyCreatedRecord = await UserRepository.createUser(mockUser);
      const user = await UserRepository.findUserById(newlyCreatedRecord.id);

      assert(user);
      expect(user).to.containSubset(mockUser);
    });

    it('should return null if cannot find user with given id', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      await UserRepository.createUser(mockUser);
      const user = await UserRepository.findUserById(getNewMongoId());

      assert(!user);
    });
  });

  describe('findUserByEmail', () => {
    it('should be able to find user by email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      await UserRepository.createUser(mockUser);
      const user = await UserRepository.findUserByEmail('test@example.com');

      assert(user);
      expect(user).to.containSubset(mockUser);
    });

    it('should return null if cannot find user with given email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      UserRepository.createUser(mockUser);
      const user = await UserRepository.findUserByEmail('fake@example.com');

      assert(!user);
    });
  });
});
