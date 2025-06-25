import { useMongoDB } from '@/testutils/mongoDB.testutil';

import { beforeEach, describe } from 'mocha';
import bcrypt from 'bcryptjs';
import { UserRepository } from '@/repositories/user.repository';

import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';

import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';

import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';

import { SystemRole } from '@vtmp/common/constants';
import { AuthType } from '@vtmp/server-common/constants';
import { JWTUtils } from '@vtmp/server-common/utils';
import assert from 'assert';
import { JWT_TOKEN_TYPE } from '@/constants/enums';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { addDays } from 'date-fns';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { omit } from 'remeda';

describe('AuthController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let mockInvitationToken: string;
  let signupBody: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: string;
  };

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    mockInvitationToken = JWTUtils.createTokenWithPayload(
      { receiverEmail: 'test123@gmail.com' },
      EnvConfig.get().JWT_SECRET,
      { expiresIn: '7d' }
    );
    await InvitationRepository.createInvitation({
      receiverEmail: 'test123@gmail.com',
      sender: getNewMongoId(),
      expiryDate: addDays(Date.now(), 7),
      token: mockInvitationToken,
    });
    signupBody = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test123@gmail.com',
      password: 'Test!123',
      token: mockInvitationToken,
    };
  });

  describe('POST /auth/login', () => {
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

    it('should return error messages for missing email and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 2 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Email is required');
      expect(errors[1].message).to.equal('Password is required');
    });

    it('should return error message for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'test' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Email is required');
    });

    it('should return error message for missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com' });

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Password is required');
    });

    it('should return error message for user not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notfound@gmail.com', password: 'test password' });

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('User not found');
    });

    it('should return error message for valid user but wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: 'wrong password' });

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Wrong password');
    });

    it('should return token for valid email and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: 'test password' });

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('token');
    });
  });

  describe('POST /auth/signup', () => {
    it('should return error message for no invitation token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(omit(signupBody, ['token']));
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'An invitation token is required'
      );
    });

    it('should return error message for invalid invitation token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          token: 'invalid-token',
        });
      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('jwt malformed');
    });

    it('should return error message for invitation not existed with associated email', async () => {
      const invalidToken = JWTUtils.createTokenWithPayload(
        { receiverEmail: 'notfound@gmail.com' },
        EnvConfig.get().JWT_SECRET,
        { expiresIn: '7d' }
      );
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          token: invalidToken,
        });
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invitation not found');
    });

    it('should return error message for unrecognized field', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          role: SystemRole.ADMIN,
        });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        "Unrecognized key(s) in object: 'role'"
      );
    });

    it('should return error message for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(omit(signupBody, ['email']))
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Email is required');
    });

    it('should return error message for password being too short', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          password: 'vT1?',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password must be between 8 and 20 characters'
      );
    });

    it('should return error message for password being too long', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          password: 'Thisisasuperlongpasswordthatcouldbeshortened!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password must be between 8 and 20 characters'
      );
    });

    it('should return error message for password having no special characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          password: 'Test1234',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 special character in [!, @, #, $, %, ^, &, ?]'
      );
    });

    it('should return error message for password having no uppercase characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          password: 'test123!',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 uppercase letter'
      );
    });

    it('should return error message for password having no lowercase characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          password: 'TEST!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 lowercase letter'
      );
    });

    it('should return error message for password having no digit', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...signupBody,
          password: 'Test!!!@@',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 digit'
      );
    });

    it('should return error message for duplicate email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test123@gmail.com',
        encryptedPassword: 'Test!123',
      };
      await UserRepository.createUser(mockUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send(signupBody)
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Email is already taken, please sign up with a different email'
      );
    });

    it('should return new user', async () => {
      const res = await request(app).post('/api/auth/signup').send(signupBody);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('token');
    });
  });

  describe('POST /auth/signup + POST /auth/login', () => {
    it('should not allow user to login after signup if wrong password', async () => {
      const resSignup = await request(app)
        .post('/api/auth/signup')
        .send(signupBody);
      expectSuccessfulResponse({ res: resSignup, statusCode: 200 });
      expect(resSignup.body.data).to.have.property('token');

      const resLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test123@gmail.com', password: 'test Password' });
      expectErrorsArray({ res: resLogin, statusCode: 401, errorsCount: 1 });
      const errors = resLogin.body.errors;
      expect(errors[0].message).to.equal('Wrong password');
    });

    it('should allow user to login after signup', async () => {
      const resSignup = await request(app)
        .post('/api/auth/signup')
        .send(signupBody);
      expectSuccessfulResponse({ res: resSignup, statusCode: 200 });
      expect(resSignup.body.data).to.have.property('token');

      const resLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test123@gmail.com', password: 'Test!123' });

      expectSuccessfulResponse({ res: resLogin, statusCode: 200 });
      expect(resLogin.body.data).to.have.property('token');
    });
  });

  describe('POST /auth/request-password-reset', () => {
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

    it('should return error message for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/request-password-reset')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          password: 'Test!123',
        })
        .set('Accept', 'application/json');
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Email is required');
    });

    it('should return error message for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: 'invalid-email' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invalid email address');
    });

    it('should return success message for valid email', async () => {
      const res = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: 'test@gmail.com' })
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal(
        'If the account exists with this email, you will receive a password reset link via email'
      );
    });
  });

  describe('PATCH /auth/reset-password', () => {
    let resetToken: string;
    let userId: string;

    beforeEach(async () => {
      const encryptedPassword = await bcrypt.hash('test password', 10);
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword,
      };

      const user = await UserRepository.createUser(mockUser);
      userId = user._id.toString();

      resetToken = JWTUtils.createTokenWithPayload(
        {
          id: userId,
          authType: AuthType.USER,
          email: user.email,
          purpose: JWT_TOKEN_TYPE.RESET_PASSWORD,
        },
        EnvConfig.get().JWT_SECRET,
        {
          expiresIn: '10m',
        }
      );
    });

    it('should return error message for password being too short', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'vT1?',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password must be between 8 and 20 characters'
      );
    });

    it('should return error message for password being too long', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'Thisisasuperlongpasswordthatcouldbeshortened!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password must be between 8 and 20 characters'
      );
    });

    it('should return error message for password having no special characters', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({ token: resetToken, newPassword: 'Test1234' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 special character in [!, @, #, $, %, ^, &, ?]'
      );
    });

    it('should return error message for password having no uppercase characters', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({ token: resetToken, newPassword: 'test123!' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 uppercase letter'
      );
    });

    it('should return error message for password having no lowercase characters', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({ token: resetToken, newPassword: 'TEST!123' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 lowercase letter'
      );
    });

    it('should return error message for password having no digit', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({ token: resetToken, newPassword: 'Test!!!@@' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 digit'
      );
    });

    it('should return error for missing token', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({ newPassword: 'Testpass@1234' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Token is required');
    });

    it('should reset password successfully', async () => {
      const res = await request(app)
        .patch('/api/auth/reset-password')
        .send({ token: resetToken, newPassword: 'Newpassword@123' })
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('reset');
      expect(res.body.message).to.equal('Password has been reset successfully');

      const updatedUser = await UserRepository.getUserById(userId, {
        includePasswordField: true,
      });

      assert(updatedUser);
      const isPasswordCorrect = await bcrypt.compare(
        'Newpassword@123',
        updatedUser.encryptedPassword
      );

      assert(isPasswordCorrect);
    });
  });
});
