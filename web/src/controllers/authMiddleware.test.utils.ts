import request from 'supertest';
import { expect } from 'chai';
import app from '@/app';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

interface IAuthMiddlewareTest {
  route: string;
  method: HTTPMethod;
  token?: string;
  body?: Record<string, any>;
}

export const runDefaultAuthMiddlewareTests = ({
  route,
  method,
  body = {},
}: IAuthMiddlewareTest) => {
  describe('AuthMiddleware For Controller', () => {
    it('should Unauthorized for no token', async () => {
      const res = await request(app)
        [method](route)
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer`);

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
  });
};
