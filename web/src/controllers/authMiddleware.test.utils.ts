import request from 'supertest';
import { expect } from 'chai';
import app from '@/app';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';
import bcrypt from 'bcryptjs';
import { toLowerCase } from 'remeda';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface IAuthMiddlewareTest {
  route: string;
  method: HTTPMethod;
  token?: string;
  body?: object;
}

export const runUserLogin = async (): Promise<{
  mockUserId: string;
  mockUserToken: string;
}> => {
  const encryptedPassword = await bcrypt.hash('test password', 10);
  const mockUser = {
    firstName: 'User',
    lastName: 'viettech',
    email: 'test@gmail.com',
    encryptedPassword,
  };
  const mockUserId = (await UserRepository.createUser(mockUser)).id;
  const mockUserToken = (
    await AuthService.login({
      email: mockUser.email,
      password: 'test password',
    })
  ).token;

  return { mockUserId, mockUserToken };
};

export const runDefaultAuthMiddlewareTests = ({
  route,
  method,
  body = {},
}: IAuthMiddlewareTest) => {
  describe(`AuthMiddleware: ${method} ${route}`, () => {
    it('should Unauthorized for no token', async () => {
      const callDynamicReq = request(app)[toLowerCase(method)];
      const res = await callDynamicReq(route)
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer`);

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Unauthorized');
    });

    it('should throw Unauthorized for wrong token', async () => {
      const callDynamicReq = request(app)[toLowerCase(method)];
      const res = await callDynamicReq(route)
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', 'fake token');

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('jwt malformed');
    });
  });
};
