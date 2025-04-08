import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import app from '@/app';
import request from 'supertest';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { EnvConfig } from '@/config/env';
import jwt from 'jsonwebtoken';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';
import { DecodedJWTSchema } from '@/middlewares/auth.middleware';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('UserRepository', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  describe('AuthMiddleware', () => {
    it('should throw Unauthorized for no token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', ``);
      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
    });

    it('should throw Unauthorized for wrong token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', `fake token`);
      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
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
      const id = DecodedJWTSchema.parse(decoded).id;

      const resGetProfile = await request(app)
        .get('/api/users/profile')
        .send({})
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(resGetProfile.body).to.have.property('id');
      expect(resGetProfile.body.id).to.equal(id);
    });
  });
});
