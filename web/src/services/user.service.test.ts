import { describe } from 'mocha';
import UserService from './user.service';
import { expect } from 'chai';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { UserRepository } from '@/repositories/user.repository';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { assert } from 'console';
import { UserRole } from '@/types/enums';
import { IUser } from '@/models/user.model';

describe('User Service', () => {
  useMongoDB();

  describe('getAllUsers', () => {
    it('should return empty array when there are no users', async () => {
      const users = await UserService.getAllUsers();
      expect(users).to.be.an('array');
      expect(users).to.have.lengthOf(0);
    });

    it('should successfully get all the users when users exist', async () => {
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

      await expect(UserService.getAllUsers()).eventually.fulfilled;
    });

    it('should return all users without encrypted password field', async () => {
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

      const users = await UserService.getAllUsers();
      expect(users).to.be.an('array');
      expect(users).to.have.lengthOf(mockUsers.length);
      for (const user of users) {
        expect(user).to.not.have.property('encryptedPassword');
      }
    });
  });

  describe('getUserById', () => {
    let user: IUser;
    beforeEach(async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      user = await UserRepository.createUser(mockUser);
    });

    it('should throw error when user with given id not exists', async () => {
      await expect(
        UserService.getUserById(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error when getting an deleted user', async () => {
      await UserRepository.deleteUserById(user.id);
      await expect(UserService.getUserById(user.id)).eventually.rejectedWith(
        ResourceNotFoundError
      );
    });

    it('should successfully get the user with given id', async () => {
      await expect(UserService.getUserById(user.id)).eventually.fulfilled;
    });

    it('should return user without encrypted password field', async () => {
      const userById = await UserService.getUserById(user.id);
      assert(userById);
      expect(userById).to.not.have.property('encryptedPassword');
    });
  });

  describe('updateUserById', () => {
    let user: IUser;
    beforeEach(async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      user = await UserRepository.createUser(mockUser);
    });

    it('should throw error when user with given id not exists', async () => {
      await expect(
        UserService.updateUserById(getNewMongoId(), {})
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error when updating a soft deleted user', async () => {
      await UserRepository.deleteUserById(user.id);
      await expect(
        UserService.updateUserById(user.id, {})
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error when updating email is already taken', async () => {
      await expect(
        UserService.updateUserById(user.id, { email: user.email })
      ).eventually.rejectedWith(DuplicateResourceError);
    });

    it('should successfully update one field of user with given id', async () => {
      await expect(
        UserService.updateUserById(user.id, { role: UserRole.ADMIN })
      ).eventually.fulfilled;
    });

    it('should successfully update one field and return user without encrypted password field', async () => {
      expect(user.role).to.equal(UserRole.USER);

      const updatedUser = await UserService.updateUserById(user.id, {
        role: UserRole.ADMIN,
      });

      assert(updatedUser);
      expect(updatedUser).to.have.property('role');
      expect(updatedUser.role).to.equal(UserRole.ADMIN);
    });

    it('should successfully update multiple fields of user with given id', async () => {
      await expect(
        UserService.updateUserById(user.id, {
          firstName: 'admin2',
          role: UserRole.ADMIN,
        })
      ).eventually.fulfilled;
    });

    it('should successfully update multiple fields and return user without encrypted password field', async () => {
      expect(user.firstName).to.equal('admin1');
      expect(user.role).to.equal(UserRole.USER);

      const updatedUser = await UserService.updateUserById(user.id, {
        firstName: 'admin2',
        role: UserRole.ADMIN,
      });

      assert(updatedUser);
      expect(updatedUser.firstName).to.equal('admin2');
      expect(updatedUser.role).to.equal(UserRole.ADMIN);
    });
  });
});
