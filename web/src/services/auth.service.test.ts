import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import { AuthService } from './auth.service';

import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { ResourceNotFoundError, UnauthorizedError } from '@/utils/errors';
import { assert } from 'console';

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Role } from '@/models/user.model';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('AuthService', () => {
  useMongoDB();
  const sandbox = useSandbox();

  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  describe('login', () => {
    beforeEach(async () => {
      const encryptedPassword = await bcrypt.hash('test password', 10);
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'test password',
      };
      await UserRepository.createUser(mockUser);
    });

    it('should throw error for user not found', async () => {
      const userData = {
        email: 'fake@gmail.com',
        password: 'test password',
      };
      await expect(AuthService.login(userData)).eventually.rejectedWith(
        ResourceNotFoundError
      );
    });

    it('should throw error for wrong password', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'wrong password',
      };

      await expect(AuthService.login(userData)).eventually.rejectedWith(
        UnauthorizedError
      );
    });

    it('should login successfully', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'test password',
      };

      await expect(AuthService.login(userData)).eventually.fulfilled;
    });

    it('should login successfully and return valid jwt token', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'test password',
      };
      const token = await AuthService.login(userData);
      assert(token);
    });
  });

  describe('Signup', () => {
    it('should fail to signup due to duplicate email', async () => {
      const userData = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'test',
        role: Role.ADMIN,
      };

      try {
        await AuthService.signup(userData);
      } catch (error: any) {
        console.log(error.message);
        expect(error.message).to.deep.equal(`Duplicate Email`);
      }
    });

    it('should signup successfully', async () => {
      const userData = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test12@gmail.com',
        encryptedPassword: 'test',
        role: Role.ADMIN,
      };

      try {
        const user = await AuthService.signup(userData);
        expect(user).to.have.deep.property('firstName', userData.firstName);
        expect(user).to.have.deep.property('lastName', userData.lastName);
        expect(user).to.have.deep.property('email', userData.email);
        expect(user).to.have.deep.property('role', userData.role);
      } catch (error: any) {
        throw new Error('signup successfully but return wrong user data');
      }
    });
  });
});
