import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import app from '@/app';
import request from 'supertest';
import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import bcrypt from 'bcryptjs';
import { EnvConfig } from '@/config/env';
import jwt from 'jsonwebtoken';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();

  beforeEach(async () => {
    const saltRounds = 10;
    const password = 'ecnrypted-password-later';
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const mockUser = {
      firstName: 'admin',
      lastName: 'viettech',
      email: 'test@example.com',
      encryptedPassword,
    };

    await UserRepository.createUser(mockUser);
  });

  describe.only('AuthMiddleware', () => {
    it('should throw Unauthorized for no token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', ``);
      console.log(res.body);
      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
    });

    it('should throw Forbidden for wrong token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', `fake token`);
      console.log(res.body);
      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
    });

    it('should allow user to login, return a token and get user profile', async () => {
      const resLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'ecnrypted-password-later',
        })
        .set('Accept', 'application/json');

      const token = resLogin.body.data.token;
      const decoded = jwt.verify(token, EnvConfig.get().JWT_SECRET);

      const resGetProfile = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', `${token}`);

      expect(resGetProfile.body).to.have.property('id');
      expect(resGetProfile.body.id).to.equal(decoded.id);
    });
  });
});
