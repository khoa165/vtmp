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

import { UserRole } from '@/types/enums';

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

    it('should return error messages for missing email and password', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({})
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expectErrorsArray({ res, statusCode: 400, errorsCount: 2 });

          const errors = res.body.errors;
          expect(errors[0].message).to.equal('Email is required');
          expect(errors[1].message).to.equal('Password is required');
          done();
        });
    });

    it('should return error message for missing email', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ password: 'test' })
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });

          const errors = res.body.errors;
          expect(errors[0].message).to.equal('Email is required');
          done();
        });
    });

    it('should return error message for missing password', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com' })
        .end((err, res) => {
          if (err) return done(err);
          expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });

          const errors = res.body.errors;
          expect(errors[0].message).to.equal('Password is required');
          done();
        });
    });

    it('should return error message for user not found', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ email: 'notfound@gmail.com', password: 'test password' })
        .end((err, res) => {
          if (err) done(err);
          expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });

          const errors = res.body.errors;
          expect(errors[0].message).to.equal('User not found');
          done();
        });
    });

    it('should return error message for valid user but wrong password', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: 'wrong password' })
        .end((err, res) => {
          if (err) done(err);
          expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });

          const errors = res.body.errors;
          expect(errors[0].message).to.equal('Wrong password');
          done();
        });
    });

    it('should return token for valid email and password', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({ email: 'test@gmail.com', password: 'test password' })
        .end((err, res) => {
          if (err) done(err);
          expectSuccessfulResponse({ res, statusCode: 200 });
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
  });

  describe('POST /auth/signup', () => {
    it('should return new user', (done) => {
      request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          password: 'test',
          email: 'test123@gmail.com',
          role: UserRole.ADMIN,
        })
        .end((err, res) => {
          if (err) done(err);

          expectSuccessfulResponse({ res, statusCode: 200 });
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('should return error messages for missing email', (done) => {
      request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          password: 'test',
          role: UserRole.ADMIN,
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) return done(err);

          expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
          expect(res.body.errors[0].message).to.eq('Email is required');
          done();
        });
    });

    it('should return error messages for duplicate email', (done) => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'test password',
        role: UserRole.ADMIN,
      };

      UserRepository.createUser(mockUser).then(() => {
        request(app)
          .post('/api/auth/signup')
          .send({
            firstName: 'admin',
            lastName: 'viettech',
            email: 'test@gmail.com',
            password: 'test',
            role: UserRole.ADMIN,
          })
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (err) return done(err);

            expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
            expect(res.body.errors[0].message).to.eq('Duplicate Email');
            done();
          });
      });
    });
  });
});
