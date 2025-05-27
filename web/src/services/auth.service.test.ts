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
import assert from 'assert';
import { expect } from 'chai';
import { UserRole } from '@vtmp/common/constants';
import { JWTUtils } from '@/utils/jwt';
import { EmailService } from '@/utils/email';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN_TYPE } from '@/constants/enums';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

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

      const data = await AuthService.signup(userData);

      assert(data);
      expect(data).to.have.property('token');
      expect(data.user.role).to.eq(UserRole.USER);
    });
  });

  describe('requestPasswordReset', () => {
    let sendEmailStub: sinon.SinonStub;

    beforeEach(async () => {
      sendEmailStub = sandbox
        .stub(EmailService.prototype, 'sendEmail')
        .resolves();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should throw error for user not found', async () => {
      const userData = { email: 'fake@gmail.com' };
      await expect(
        AuthService.requestPasswordReset(userData)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should send password reset email successfully', async () => {
      const encryptedPassword = await bcrypt.hash('test password', 10);
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword,
      };
      await UserRepository.createUser(mockUser);

      await expect(AuthService.requestPasswordReset({ email: mockUser.email }))
        .eventually.fulfilled;

      assert(sendEmailStub.calledOnce);
    });
  });

  describe('resetPassword', () => {
    let resetToken: string;
    let userId: string;

    beforeEach(async () => {
      const encryptedPassword = await bcrypt.hash('oldpassword', 10);
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'testreset@gmail.com',
        encryptedPassword,
      };
      const user = await UserRepository.createUser(mockUser);
      userId = user._id.toString();

      resetToken = JWTUtils.createTokenWithPayload(
        {
          id: userId,
          email: mockUser.email,
          purpose: JWT_TOKEN_TYPE.RESET_PASSWORD,
        },
        {
          expiresIn: '10m',
        }
      );
    });

    it('should throw error for invalid token purpose', async () => {
      const invalidToken = JWTUtils.createTokenWithPayload(
        { id: userId, email: 'test@gmail.com', purpose: 'login' },
        { expiresIn: '10m' }
      );
      await expect(
        AuthService.resetPassword({
          token: invalidToken,
          newPassword: 'newpassword',
        })
      ).eventually.rejectedWith(ZodError);
    });

    it('should throw error for expired token', async () => {
      const expiredToken = JWTUtils.createTokenWithPayload(
        {
          id: userId,
          email: 'test@gmail.com',
          purpose: JWT_TOKEN_TYPE.RESET_PASSWORD,
        },
        { expiresIn: '-1s' }
      );
      await expect(
        AuthService.resetPassword({
          token: expiredToken,
          newPassword: 'newpassword',
        })
      ).eventually.rejectedWith(jwt.TokenExpiredError);
    });

    it('should throw error for user not found', async () => {
      const invalidToken = JWTUtils.createTokenWithPayload(
        {
          id: getNewMongoId(),
          email: 'test@gmail.com',
          purpose: JWT_TOKEN_TYPE.RESET_PASSWORD,
        },
        { expiresIn: '10m' }
      );
      await expect(
        AuthService.resetPassword({
          token: invalidToken,
          newPassword: 'newpassword',
        })
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should throw error if the new password is the same as the old one', async () => {
      await expect(
        AuthService.resetPassword({
          token: resetToken,
          newPassword: 'oldpassword',
        })
      ).eventually.rejectedWith(
        DuplicateResourceError,
        'New password can not be similar as the old password.'
      );
    });

    it('should reset password successfully', async () => {
      const updatedUser = await AuthService.resetPassword({
        token: resetToken,
        newPassword: 'newpassword',
      });
      expect(updatedUser).to.have.property('email', 'testreset@gmail.com');

      const userFromDB = await UserRepository.getUserById(userId, {
        includePasswordField: true,
      });
      assert(userFromDB);

      const isPasswordMatch = await bcrypt.compare(
        'newpassword',
        userFromDB.encryptedPassword
      );
      assert(isPasswordMatch);
    });
  });
});
