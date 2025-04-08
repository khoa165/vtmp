import { describe } from 'mocha';
import UserService from './user.service';
import { expect } from 'chai';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { UserRepository } from '@/repositories/user.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { assert } from 'console';
import { UserRole } from '@/types/enums';

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
    it('should throw error when user with given id not exists', async () => {
      await expect(
        UserService.getUserById(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error when getting an deleted user', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);
      await UserRepository.deleteUserById(newUser.id);

      await expect(UserService.getUserById(newUser.id)).eventually.rejectedWith(
        ResourceNotFoundError
      );
    });

    it('should successfully get the user with given id', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);

      await expect(UserService.getUserById(newUser.id)).eventually.fulfilled;
    });

    it('should return user without encrypted password field', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);

      const user = await UserService.getUserById(newUser.id);
      assert(user);
      expect(user).to.not.have.property('encryptedPassword');
    });
  });

  describe('updateUserById', () => {
    it('should throw error when user with given id not exists', async () => {
      await expect(
        UserService.updateUserById(getNewMongoId(), {})
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error when updating an deleted user', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);
      await UserRepository.deleteUserById(newUser.id);

      await expect(
        UserService.updateUserById(newUser.id, {})
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should successfully update one field of user with given id', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);

      await expect(
        UserService.updateUserById(newUser.id, { role: UserRole.ADMIN })
      ).eventually.fulfilled;
    });

    it('should successfully update one field and return user without encrypted password field', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);
      expect(newUser.role).to.equal(UserRole.USER);

      const updatedUser = await UserService.updateUserById(newUser.id, {
        role: UserRole.ADMIN,
      });

      assert(updatedUser);
      expect(updatedUser).to.have.property('role');
      expect(updatedUser.role).to.equal(UserRole.ADMIN);
    });

    it('should successfully update multiple fields of user with given id', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);

      await expect(
        UserService.updateUserById(newUser.id, {
          firstName: 'admin2',
          role: UserRole.ADMIN,
        })
      ).eventually.fulfilled;
    });

    it('should successfully update multiple fields and return user without encrypted password field', async () => {
      const mockUser = {
        firstName: 'admin1',
        lastName: 'viettech',
        email: 'test1@example.com',
        encryptedPassword: 'ecnrypted-password-later',
      };
      const newUser = await UserRepository.createUser(mockUser);
      expect(newUser.firstName).to.equal('admin1');
      expect(newUser.role).to.equal(UserRole.USER);

      const updatedUser = await UserService.updateUserById(newUser.id, {
        firstName: 'admin2',
        role: UserRole.ADMIN,
      });

      assert(updatedUser);
      expect(updatedUser.firstName).to.equal('admin2');
      expect(updatedUser.role).to.equal(UserRole.ADMIN);
    });
  });
});
