import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import assert from 'assert';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { IUser } from '@/models/user.model';
import { UserRole } from '@/types/enums';
import { differenceInSeconds } from 'date-fns';

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

  describe('getUserById', () => {
    it('should return null if cannot get user with given id', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      await UserRepository.createUser(mockUser);
      const user = await UserRepository.getUserById(getNewMongoId());

      assert(!user);
    });

    it('should be able to get user by id', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newlyCreatedRecord = await UserRepository.createUser(mockUser);
      const user = await UserRepository.getUserById(newlyCreatedRecord.id);

      assert(user);
      expect(user).to.containSubset(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return null if cannot get user with given email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      await UserRepository.createUser(mockUser);

      const user = await UserRepository.getUserByEmail('fake@example.com');
      assert(!user);
    });

    it('should be able to get user by email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      await UserRepository.createUser(mockUser);

      const user = await UserRepository.getUserByEmail('test@example.com');
      assert(user);
      expect(user).to.containSubset(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return an empty array when there are no users', async () => {
      const users = await UserRepository.getAllUsers();
      expect(users).to.be.an('array');
      expect(users).to.have.lengthOf(0);
    });

    it('should return an array of all users', async () => {
      const mockUsers = [
        {
          firstName: 'admin1',
          lastName: 'viettech',
          email: 'test1@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
        {
          firstName: 'admin2',
          lastName: 'viettech',
          email: 'test2@example.com',
          encryptedPassword: 'ecnrypted-password-later',
        },
      ];
      await Promise.all(
        mockUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );

      const users = await UserRepository.getAllUsers();
      expect(users).to.be.an('array');
      expect(users).to.have.lengthOf(mockUsers.length);
      for (let i = 0; i < users.length; i++) {
        expect(users[i]).to.containSubset(mockUsers[i]);
      }
    });
  });

  describe('updateUserById', () => {
    let user: IUser;

    beforeEach(async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      user = await UserRepository.createUser(mockUser);
    });

    it('should return null if no user found with given id', async () => {
      const updatedUser = await UserRepository.updateUserById(
        getNewMongoId(),
        {}
      );
      assert(!updatedUser);
    });

    it('should return updated user if user found', async () => {
      const updatedUser = await UserRepository.updateUserById(user.id, {
        firstName: 'adminViettech',
        email: 'testupdate@gmail.com',
        role: UserRole.ADMIN,
      });

      assert(updatedUser);
      expect(updatedUser.firstName).to.be.equal('adminViettech');
      expect(updatedUser.email).to.be.equal('testupdate@gmail.com');
      expect(updatedUser.role).to.be.equal(UserRole.ADMIN);
    });
  });

  describe('deleteUserById', () => {
    let user: IUser;

    beforeEach(async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      user = await UserRepository.createUser(mockUser);
    });

    it('should return null if no user found with given id', async () => {
      const deletedUser = await UserRepository.deleteUserById(getNewMongoId());
      assert(!deletedUser);
    });

    it('should soft delete user and return deletedUser object with deletedAt field set', async () => {
      const deletedUser = await UserRepository.deleteUserById(user.id);
      assert(deletedUser);
      assert(deletedUser.deletedAt);

      const timeDiff = differenceInSeconds(new Date(), deletedUser.deletedAt);
      expect(timeDiff).to.lessThan(3);

      const foundUser = await UserRepository.getUserById(user.id);
      assert(!foundUser);
    });
  });
});
