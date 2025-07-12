import { JWTUtils } from '@vtmp/server-common/utils';
import bcrypt from 'bcryptjs';
import { expect } from 'chai';
import { addDays } from 'date-fns';
import { toLowerCase } from 'remeda';
import request from 'supertest';

import { SystemRole } from '@vtmp/common/constants';

import app from '@/app';
import { EnvConfig } from '@/config/env';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { AuthService } from '@/services/auth.service';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { expectErrorsArray } from '@/testutils/response-assertion.testutil';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

interface IAuthMiddlewareTest {
  route: string;
  method: HTTPMethod;
  body?: object;
}

export const runUserLogin = async (): Promise<{
  mockUserId: string;
  mockUserToken: string;
  mockAdminId: string;
  mockAdminToken: string;
  mockModeratorId: string;
  mockModeratorToken: string;
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

  const mockAdmin = {
    firstName: 'Admin',
    lastName: 'viettech',
    email: 'admin@gmail.com',
    encryptedPassword,
    role: SystemRole.ADMIN,
  };
  const mockAdminId = (await UserRepository.createUser(mockAdmin)).id;
  const mockAdminToken = (
    await AuthService.login({
      email: mockAdmin.email,
      password: 'test password',
    })
  ).token;

  const mockModerator = {
    firstName: 'Moderator',
    lastName: 'viettech',
    email: 'moderator@gmail.com',
    encryptedPassword,
    role: SystemRole.MODERATOR,
  };
  const mockModeratorId = (await UserRepository.createUser(mockModerator)).id;
  const mockModeratorToken = (
    await AuthService.login({
      email: mockModerator.email,
      password: 'test password',
    })
  ).token;

  return {
    mockUserId,
    mockUserToken,
    mockAdminId,
    mockAdminToken,
    mockModeratorId,
    mockModeratorToken,
  };
};

export const runDefaultAuthMiddlewareTests = ({
  route,
  method,
  body = {},
}: IAuthMiddlewareTest) => {
  describe(`AuthMiddleware: ${method} ${route}`, () => {
    const callDynamicReq = request(app)[toLowerCase(method)];
    it('should Unauthorized for no token', async () => {
      const res = await callDynamicReq(route)
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer`);

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Unauthorized');
    });

    it('should throw Unauthorized for wrong token', async () => {
      const res = await callDynamicReq(route)
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', 'fake token');

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('jwt malformed');
    });
  });
};

export const createMockInvitation = async (receiverEmail: string) => {
  const mockInvitation = {
    receiverName: 'admin viettech',
    receiverEmail,
    sender: getNewMongoId(),
    expiryDate: addDays(Date.now(), 7),
  };

  const token = JWTUtils.createTokenWithPayload(
    { receiverEmail: mockInvitation.receiverEmail },
    EnvConfig.get().JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return await InvitationRepository.createInvitation({
    ...mockInvitation,
    token,
  });
};
