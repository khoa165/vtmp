import app from '@/app';
import { AuthService } from '@/services/auth.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import request from 'supertest';
import { expect } from 'chai';
import { IUser } from '@/models/user.model';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { UserRole } from '@common/enums';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';

describe('UserController', () => {
  useMongoDB();
  const sandbox = useSandbox();

  let mockToken: string;
  let mockUserId: string;
  const mockOneUser = {
    firstName: 'admin1',
    lastName: 'viettech',
    email: 'test1@example.com',
    password: 'Test123!',
  };

  const mockMultipleUsers = [
    {
      firstName: 'admin2',
      lastName: 'viettech',
      email: 'test2@example.com',
      password: 'Test123!',
    },
    {
      firstName: 'admin3',
      lastName: 'viettech',
      email: 'test3@example.com',
      password: 'Test234!',
    },
  ];

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);

    mockUserId = (await AuthService.signup(mockOneUser)).id;
    mockToken = await AuthService.login({
      email: mockOneUser.email,
      password: mockOneUser.password,
    });
  });

  describe('GET /users', () => {
    it('should return array of length 1 when no users exist except current user', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      const users = res.body.data;
      expect(users).to.be.an('array').that.have.lengthOf(1);
    });

    it('should return an array of all existing users without encryptedPassword field', async () => {
      await Promise.all(
        mockMultipleUsers.map((mockUser) => AuthService.signup(mockUser))
      );

      const res = await request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      const users = res.body.data;
      expect(users).to.be.an('array').that.have.lengthOf(3);
      users.forEach((user: IUser) => {
        expect(user).to.not.have.property('encryptedPassword');
      });
    });
  });

  describe('GET /users/:userId', () => {
    it('should return error message forbidden user try to get other user information', async () => {
      const res = await request(app)
        .get(`/api/users/${getNewMongoId()}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Cannot get other user information');
    });

    it('should return user with requested id without encryptedPassword field', async () => {
      const res = await request(app)
        .get(`/api/users/${mockUserId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body).to.have.property('data');
      expect(res.body).to.not.have.property('encryptedPassword');
    });
  });

  describe('PUT /users/:userId', () => {
    it('should return error message forbidden for updaing other user information', async () => {
      const updateInfo = {
        firstName: 'admin_update',
        lastName: 'viettech',
      };

      const res = await request(app)
        .put(`/api/users/${getNewMongoId()}`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal(
        'Cannot update other user information'
      );
    });

    it('should return error message for updating email ', async () => {
      const updateInfo = {
        email: 'test4@example.com',
      };

      const res = await request(app)
        .put(`/api/users/${mockUserId}`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Unallowed fields to be updated!');
    });

    it('should return error message for updating password ', async () => {
      const updateInfo = {
        password: 'new-password',
      };

      const res = await request(app)
        .put(`/api/users/${mockUserId}`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Unallowed fields to be updated!');
    });

    it('should return error message for updating role', async () => {
      const updateInfo = {
        role: UserRole.ADMIN,
      };

      const res = await request(app)
        .put(`/api/users/${mockUserId}`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Unallowed fields to be updated!');
    });

    it('should return updated user without encryptedPassword field', async () => {
      const updateInfo = {
        firstName: 'admin_update',
        lastName: 'viettech_update',
      };

      const res = await request(app)
        .put(`/api/users/${mockUserId}`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.containSubset(updateInfo);
      expect(res.body.data).to.not.have.property('encryptedPassword');
    });
  });

  describe('PUT /users/:userId/role', () => {
    it('should return error message for updating fields that is not role', async () => {
      const updateInfo = {
        firstName: 'admin_update',
        lastName: 'viettech',
      };

      const res = await request(app)
        .put(`/api/users/${mockUserId}/role`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 2 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Role is required');
      expect(errors[1].message).to.equal('Can only update role');
    });

    it('should return error message not found for user not exist', async () => {
      const updateInfo = {
        role: UserRole.ADMIN,
      };

      const res = await request(app)
        .put(`/api/users/${getNewMongoId()}/role`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      const errors = res.body.errors;
      expect(errors[0].message).to.equal('User not found. Cannot update');
    });

    it('should return updated user without encryptedPassword field', async () => {
      const updateInfo = {
        role: UserRole.ADMIN,
      };

      const res = await request(app)
        .put(`/api/users/${mockUserId}/role`)
        .send(updateInfo)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.containSubset(updateInfo);
      expect(res.body.data).to.not.have.property('encryptedPassword');
    });
  });
});
