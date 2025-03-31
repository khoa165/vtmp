import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import bcrypt from 'bcryptjs';
import UserRepository from '@/repositories/user.repository';
import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';
import { IUser, Role } from '@/types/interface';

describe('POST /auth/signup', () => {
  useMongoDB();

  // Later when /auth/signup works, replace this with a call
  // to /auth/signup to create a mock user in DB
  beforeEach(async () => {
    const encryptedPassword = await bcrypt.hash('test password', 10);
    const mockUser: IUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@gmail.com',
      encryptedPassword,
      role: Role.ADMIN,
    };
    await UserRepository.create(mockUser);
  });

  it('should return new user', (done) => {
    request(app)
      .post('/signup')
      .send({
        firstName: 'admin',
        lastName: 'viettech',
        encryptedPassword: 'test',
        email: 'test123@gmail.com',
        role: Role.ADMIN,
      })
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).to.eq(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  //   Testing error message when missing a field
  it('should return error messages for missing firstName', (done) => {
    request(app)
      .post('/signup')
      .send({
        lastName: 'viettech',
        encryptedPassword: 'test',
        email: 'test@gmail.com',
        role: Role.ADMIN,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq('Firstname is required');
        done();
      });
  });

  it('should return error messages for missing password', (done) => {
    request(app)
      .post('/signup')
      .send({
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test123@gmail.com',
        role: Role.ADMIN,
      })
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq('Password is required');
        done();
      });
  });

  it('should return error messages for missing lastName', (done) => {
    request(app)
      .post('/signup')
      .send({
        firstName: 'admin',
        encryptedPassword: 'test',
        email: 'test123@gmail.com',
        role: Role.ADMIN,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq('Lastname is required');
        done();
      });
  });

  it('should return error messages for missing role', (done) => {
    request(app)
      .post('/signup')
      .send({
        firstName: 'admin',
        lastName: 'viettech',
        encryptedPassword: 'test',
        email: 'test123@gmail.com',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq('Role is required');
        done();
      });
  });

  it('should return error messages for missing email', (done) => {
    request(app)
      .post('/signup')
      .send({
        firstName: 'admin',
        lastName: 'viettech',
        encryptedPassword: 'test',
        role: Role.ADMIN,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq('Email is required');
        done();
      });
  });

  //   Testing duplicate email
  it('should return error messages for duplicate email', (done) => {
    request(app)
      .post('/signup')
      .send({
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'test',
        role: Role.ADMIN,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return done(err);

        expect(res.statusCode).to.eq(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.eq('Duplicate Email');
        done();
      });
  });
});
