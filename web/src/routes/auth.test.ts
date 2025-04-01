import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import bcrypt from 'bcryptjs';
import UserRepository from '@/repositories/user.repository';
import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';

describe('POST /auth/login', () => {
  useMongoDB();
  const sandbox = useSandbox();
  const mockEnvs = {
    PORT: 8000,
    MONGO_URI: 'mongodb://username:password@localhost:27017/database_name',
    JWT_SECRET: 'vtmp-secret',
  };

  // Later when /auth/signup works, replace this with a call
  // to /auth/signup to create a mock user in DB
  beforeEach(async () => {
    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
    };
    await UserRepository.create(mockUser);
    sandbox.stub(EnvConfig, 'get').returns(mockEnvs);
  });

  it('should return error messages for missing email and password', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({})
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.an('array');

        const errors = res.body.errors;
        expect(errors[0]?.message).to.eq('Email is required');
        expect(errors[1]?.message).to.eq('Password is required');
        done();
      });
  });

  it('should return error messages for missing email', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ password: 'test' })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.an('array');

        const errors = res.body.errors;
        expect(errors[0]?.message).to.eq('Email is required');
        done();
      });
  });

  it('should return error messages for missing password', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'test@gmail.com' })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.an('array');

        const errors = res.body.errors;
        expect(errors[0]?.message).to.eq('Password is required');
        done();
      });
  });

  it('should return error messages for user not found', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@gmail.com', password: 'test password' })
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).to.eq(401);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.an('array');

        const errors = res.body.errors;
        expect(errors[0]?.message).to.eq('User not found');

        done();
      });
  });

  it('should return error message for valid user but wrong password', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'test@gmail.com', password: 'wrong password' })
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).to.eq(401);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.be.an('array');

        const errors = res.body.errors;
        expect(errors[0]?.message).to.eq('Wrong password');

        done();
      });
  });

  it('should return token for valid email and password', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'test@gmail.com', password: 'test password' })
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).to.eq(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token');

        done();
      });
  });
});
