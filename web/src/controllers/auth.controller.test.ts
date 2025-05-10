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
import { UserRole } from '@vtmp/common/constants';

describe('AuthController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
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
    it('should return error message for unrecognized field', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        firstName: 'admin',
        lastName: 'viettech',
        password: 'Test!123',
        email: 'test123@gmail.com',
        role: UserRole.ADMIN,
      });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        "Unrecognized key(s) in object: 'role'"
      );
    });

    it('should return error message for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          password: 'Test!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Email is required');
    });

    it('should return error message for password being too short', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
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
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
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
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
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
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
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
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
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
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
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
        email: 'test@gmail.com',
        encryptedPassword: 'Test!123',
      };
      await UserRepository.createUser(mockUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'Test!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Email is already taken, please sign up with a different email'
      );
    });

    it('should return new user', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        firstName: 'admin',
        lastName: 'viettech',
        password: 'Test!123',
        email: 'test123@gmail.com',
      });
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('token');
    });
  });

  describe('POST /auth/signup + POST /auth/login', () => {
    it('should not allow user to login after signup if wrong password', async () => {
      const resSignup = await request(app).post('/api/auth/signup').send({
        firstName: 'admin',
        lastName: 'viettech',
        password: 'Test!123',
        email: 'test123@gmail.com',
      });
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
      const resSignup = await request(app).post('/api/auth/signup').send({
        firstName: 'admin',
        lastName: 'viettech',
        password: 'Test!123',
        email: 'test123@gmail.com',
      });
      expectSuccessfulResponse({ res: resSignup, statusCode: 200 });
      expect(resSignup.body.data).to.have.property('token');

      const resLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test123@gmail.com', password: 'Test!123' });

      expectSuccessfulResponse({ res: resLogin, statusCode: 200 });
      expect(resLogin.body.data).to.have.property('token');
    });
  });
});
