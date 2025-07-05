import { IUser } from '@vtmp/mongo/models';
import { expect } from 'chai';
import { describe } from 'mocha';

import assert from 'assert';

import { SystemRole } from '@vtmp/common/constants';

import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';

import UserService from './user.service';

describe('User Service', () => {
  useMongoDB();

  const mockOneUser = {
    firstName: 'admin1',
    lastName: 'viettech',
    email: 'test1@example.com',
    encryptedPassword: 'encrypted-password-later',
  };

  const mockMultipleUsers = [
    {
      firstName: 'admin1',
      lastName: 'viettech',
      email: 'test2@example.com',
      encryptedPassword: 'encrypted-password-later',
    },
    {
      firstName: 'admin2',
      lastName: 'viettech',
      email: 'test3@example.com',
      encryptedPassword: 'encrypted-password-later',
    },
  ];

  describe('getAllUsers', () => {
    it('should return empty array when there are no users', async () => {
      const users = await UserService.getAllUsers();
      expect(users).to.be.an('array').that.have.lengthOf(0);
    });

    it('should successfully get all the users when users exist', async () => {
      await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );

      await expect(UserService.getAllUsers()).eventually.fulfilled;
    });

    it('should return all users without encrypted password field', async () => {
      await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );

      const users = await UserService.getAllUsers();
      expect(users)
        .to.be.an('array')
        .that.have.lengthOf(mockMultipleUsers.length);
      expect(users.map((user) => user.email)).to.have.members(
        mockMultipleUsers.map((mockUser) => mockUser.email)
      );
      users.forEach((user) => {
        expect(user).to.not.have.property('encryptedPassword');
      });
    });
  });

  describe('getUserById', () => {
    let user: IUser;
    beforeEach(async () => {
      user = await UserRepository.createUser(mockOneUser);
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
      user = await UserRepository.createUser(mockOneUser);
      await Promise.all(
        mockMultipleUsers.map((mockUser) => UserRepository.createUser(mockUser))
      );
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
        UserService.updateUserById(user.id, { email: 'test2@example.com' })
      ).eventually.rejectedWith(DuplicateResourceError);
    });

    it('should successfully update one field of user with given id', async () => {
      await expect(
        UserService.updateUserById(user.id, { role: SystemRole.ADMIN })
      ).eventually.fulfilled;
    });

    it('should successfully update one field and return user without encrypted password field', async () => {
      expect(user.role).to.equal(SystemRole.USER);

      const updatedUser = await UserService.updateUserById(user.id, {
        role: SystemRole.ADMIN,
      });

      assert(updatedUser);
      expect(updatedUser).to.have.property('role');
      expect(updatedUser.role).to.equal(SystemRole.ADMIN);
      expect(updatedUser).to.not.have.property('encryptedPassword');
    });

    it('should successfully update multiple fields of user with given id', async () => {
      await expect(
        UserService.updateUserById(user.id, {
          firstName: 'admin2',
          role: SystemRole.ADMIN,
        })
      ).eventually.fulfilled;
    });

    it('should successfully update multiple fields and return user without encrypted password field', async () => {
      expect(user.firstName).to.equal('admin1');
      expect(user.role).to.equal(SystemRole.USER);

      const updateInfo = {
        firstName: 'admin2',
        role: SystemRole.ADMIN,
      };
      const updatedUser = await UserService.updateUserById(user.id, updateInfo);

      assert(updatedUser);
      expect(updatedUser).to.deep.include(updateInfo);
      expect(updatedUser).to.not.have.property('encryptedPassword');
    });
  });
});
