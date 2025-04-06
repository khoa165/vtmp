import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import { AuthService } from '@/services/auth.service';
import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import {
  DuplicateResourceError,
  ResourceNotFoundError,
  UnauthorizedError,
} from '@/utils/errors';
import { assert } from 'console';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { UserRole } from '@/types/enums';

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
        encryptedPassword,
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

  describe('signup', () => {
    it('should fail to signup due to duplicate email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'password',
      };
      await UserRepository.createUser(mockUser);

      const userData = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test@gmail.com',
        password: 'test',
      };

      await expect(AuthService.signup(userData)).eventually.rejectedWith(
        DuplicateResourceError
      );
    });

    it('should signup successfully', async () => {
      const userData = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test12@gmail.com',
        password: 'test',
      };

      await expect(AuthService.signup(userData)).eventually.fulfilled;
    });

    it('should signup successfully with the same information', async () => {
      const userData = {
        firstName: 'admin123',
        lastName: 'viettech',
        email: 'test12@gmail.com',
        password: 'test',
      };

      const user = await AuthService.signup(userData);
      assert(user);
      expect(user.role).to.equal(UserRole.USER);
    });
  });
});
