import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
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

describe('LinkController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  describe('POST /links', () => {
    it('should be able to create new link with expected fields', (done) => {
      request(app)
        .post('/api/links')
        .send({ url: 'google.com' })
        .end((err, res) => {
          if (err) return done(err);
          expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });

          const errors = res.body.errors;
          expect(errors[0].message).to.equal('Url is required');
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
});
