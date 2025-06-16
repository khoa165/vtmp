import * as chai from 'chai';
import app from '@/app';
import request from 'supertest';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { EnvConfig } from '@/config/env';
import jwt from 'jsonwebtoken';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';
import { DecodedJWTSchema } from '@/middlewares/auth.middleware';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { AuthType } from '@vtmp/server-common/constants';

const { expect } = chai;
describe('AuthMiddleware', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  it('should throw Unauthorized for no token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Accept', 'application/json')
      .set('Authorization', '');
    expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
    expect(res.body.errors[0].message).to.eq('Unauthorized');
  });

  it('should throw Unauthorized for wrong token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Accept', 'application/json')
      .set('Authorization', 'fake token');
    expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
    expect(res.body.errors[0].message).to.eq('jwt malformed');
  });

  it('should throw ResourceNotFoundError for cannot find user', async () => {
    const token = jwt.sign(
      { id: getNewMongoId(), authType: AuthType.USER },
      MOCK_ENV.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const res = await request(app)
      .get('/api/users/profile')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expectErrorsArray({
      res,
      statusCode: 404,
      errorsCount: 1,
    });
    expect(res.body.errors[0].message).to.eq('User not found');
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
    const decoded = jwt.verify(token, MOCK_ENV.JWT_SECRET);
    const id = DecodedJWTSchema.parse(decoded).id;

    const res = await request(app)
      .get(`/api/users/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data).to.have.property('_id');
    expect(res.body.data._id).to.equal(id);
  });
});
