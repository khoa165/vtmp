import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import app from '@/app';
import request from 'supertest';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { EnvConfig } from '@/config/env';
import jwt from 'jsonwebtoken';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();

  describe.only('AuthMiddleware', () => {
    it('should throw Unauthorized for no token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', ``);
      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
    });

    it('should throw Forbidden for wrong token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', `fake token`);
      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
    });

    it('should allow user to login, return a token and get user profile', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@example.com',
          password: 'Test!123',
        })
        .set('Accept', 'application/json');

      const resLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test!123',
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
