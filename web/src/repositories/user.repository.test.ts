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
describe.only('UserRepository', () => {
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
    });

    it('should not get users that are already soft deleted', async () => {
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

      const mockSoftDeletedUser = {
        firstName: 'admin3',
        lastName: 'viettech',
        email: 'test3@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newlyCreatedUser =
        await UserRepository.createUser(mockSoftDeletedUser);
      await UserRepository.deleteUserById(newlyCreatedUser.id);

      const users = await UserRepository.getAllUsers();
      expect(users).to.be.an('array');
      expect(users).to.have.lengthOf(mockUsers.length);
    });
  });

  describe('getUserByEmail', () => {
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

    it('should return null if cannot get user with given email', async () => {
      const userFoundByEmail =
        await UserRepository.getUserByEmail('fake@example.com');
      assert(!userFoundByEmail);
    });

    it('should return null if trying to get soft deleted user by email', async () => {
      await UserRepository.deleteUserById(user.id);

      const userFoundByEmail = await UserRepository.getUserByEmail(user.email);
      assert(!userFoundByEmail);
    });

    it('should be able to get user by email', async () => {
      const userFoundByEmail = await UserRepository.getUserByEmail(user.email);
      assert(userFoundByEmail);
    });
  });

  describe('getUserById', () => {
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

    it('should return null if cannot get user with given id', async () => {
      const userFoundById = await UserRepository.getUserById(getNewMongoId());
      assert(!userFoundById);
    });

    it('should return null if trying to get soft deleted user by id', async () => {
      await UserRepository.deleteUserById(user.id);
      const userFoundById = await UserRepository.getUserById(user.id);
      assert(!userFoundById);
    });

    it('should be able to get user by id', async () => {
      const userFoundById = await UserRepository.getUserById(user.id);
      assert(userFoundById);
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

    it('should return null if trying to update a soft deleted user', async () => {
      await UserRepository.deleteUserById(user.id);
      const updatedUser = await UserRepository.updateUserById(user.id, {});
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

    it('should return null if trying to delete an already soft deleted user', async () => {
      await UserRepository.deleteUserById(user.id);
      const deletedUser = await UserRepository.deleteUserById(user.id);
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
