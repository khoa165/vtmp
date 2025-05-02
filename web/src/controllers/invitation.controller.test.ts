import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import { UserRepository } from '@/repositories/user.repository';
import app from '@/app';
import request from 'supertest';
import { expect } from 'chai';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { InvitationStatus, UserRole } from '@vtmp/common/constants';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { addDays, subDays } from 'date-fns';
import { InvitationRepository } from '@/repositories/invitation.repository';
import assert from 'assert';
import jwt from 'jsonwebtoken';
import { IInvitation } from '@/models/invitation.model';

describe('InvitationController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  const nextWeek = addDays(Date.now(), 7);
  // const mockMenteeName = 'Mentee Viettech';
  const mockAdminId = getNewMongoId();

  const mockOneInvitation = {
    receiverEmail: 'mentee@viettech.com',
    sender: mockAdminId,
    token: 'token-for-invitation',
    expiryDate: nextWeek,
  };

  const mockMultipleInvitations = [
    {
      receiverEmail: 'mentee1@viettech.com',
      sender: mockAdminId,
      token: 'token-for-invitation',
      expiryDate: nextWeek,
    },

    {
      receiverEmail: 'mentee2@viettech.com',
      sender: mockAdminId,
      token: 'token-for-invitation',
      expiryDate: nextWeek,
    },

    {
      receiverEmail: 'mentee3@viettech.com',
      sender: mockAdminId,
      token: 'token-for-invitation',
      expiryDate: nextWeek,
    },
  ];

  describe('GET /invitations/', () => {
    it('should return empty array when no invitations exist', async () => {
      const res = await request(app)
        .get('/api/invitations')
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return all invitations', async () => {
      await Promise.all(
        mockMultipleInvitations.map((mockInvitation) =>
          InvitationRepository.createInvitation(mockInvitation)
        )
      );

      const res = await request(app)
        .get('/api/invitations/')
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data)
        .to.be.an('array')
        .that.have.lengthOf(mockMultipleInvitations.length);
    });
  });

  describe('POST /invitations', () => {
    it('should return error message for unrecognized field', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        firstName: 'admin',
        lastName: 'viettech',
        password: 'Test!123',
        email: 'test123@gmail.com',
        role: UserRole.ADMIN,
      });
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        "Unrecognized key(s) in object: 'role'"
      );
    });

    it('should return error message for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          password: 'Test!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Email is required');
    });

    it('should return error message for password being too short', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'vT1?',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password must be between 8 and 20 characters'
      );
    });

    it('should return error message for password being too long', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'Thisisasuperlongpasswordthatcouldbeshortened!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password must be between 8 and 20 characters'
      );
    });

    it('should return error message for password having no special characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'Test1234',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 special character in [!, @, #, $, %, ^, &, ?]'
      );
    });

    it('should return error message for password having no uppercase characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'test123!',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 uppercase letter'
      );
    });

    it('should return error message for password having no lowercase characters', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'TEST!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 lowercase letter'
      );
    });

    it('should return error message for password having no digit', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'Test!!!@@',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Password requires at least 1 digit'
      );
    });

    it('should return error message for duplicate email', async () => {
      const mockUser = {
        firstName: 'admin',
        lastName: 'viettech',
        email: 'test@gmail.com',
        encryptedPassword: 'Test!123',
      };
      await UserRepository.createUser(mockUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'admin',
          lastName: 'viettech',
          email: 'test@gmail.com',
          password: 'Test!123',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Email is already taken, please sign up with a different email'
      );
    });

    it('should return new user', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        firstName: 'admin',
        lastName: 'viettech',
        password: 'Test!123',
        email: 'test123@gmail.com',
      });
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('token');
    });
  });

  describe('PUT /invitations/:invitationId/revoke', () => {
    it('should return error message when invitation does not exist', async () => {
      const res = await request(app)
        .put(`/api/invitations/${getNewMongoId()}/revoke`)
        .send({})
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invitation not found');
    });

    it('should return error message when invitation is not pending', async () => {
      const newInvitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        status: InvitationStatus.ACCEPTED,
      });

      const res = await request(app)
        .put(`/api/invitations/${newInvitation.id}/revoke`)
        .send({})
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Can only revoke Pending invitation'
      );
    });

    it('should successfully revoke invitation and return the invitation with updated status of REVOKED', async () => {
      const newInvitation =
        await InvitationRepository.createInvitation(mockOneInvitation);

      const res = await request(app)
        .put(`/api/invitations/${newInvitation.id}/revoke`)
        .send({})
        .set('Accept', 'application/json');

      assert(res.body.data);
      expect(res.body.data).to.deep.include({
        ...mockOneInvitation,
        expiryDate: mockOneInvitation.expiryDate.toISOString(),
      });
      expect(res.body.data.status).to.equal(InvitationStatus.REVOKED);
    });
  });

  describe('POST /invitations/validate', () => {
    let pendingInvitation: IInvitation;

    beforeEach(async () => {
      const token = jwt.sign(
        { receiverEmail: mockOneInvitation.receiverEmail },
        EnvConfig.get().JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );

      pendingInvitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        token,
      });
    });

    it('should return error message for invalid token', async () => {
      const res = await request(app)
        .post(`/api/invitations/validate`)
        .send({ token: 'fake token' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('jwt malformed');
    });

    it('should return error message for invitation not found', async () => {
      const invalidToken = jwt.sign(
        { receiverEmail: 'not-found-email@viettech.com' },
        EnvConfig.get().JWT_SECRET,
        { expiresIn: '7d' }
      );

      const res = await request(app)
        .post(`/api/invitations/validate`)
        .send({ token: invalidToken })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Invitation not found');
    });

    it('should return error message for invitation has expired', async () => {
      await InvitationRepository.updateInvitationById(pendingInvitation.id, {
        expiryDate: subDays(Date.now(), 1),
      });

      const res = await request(app)
        .post(`/api/invitations/validate`)
        .send({ token: pendingInvitation.token })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Invitation has expired');
    });

    it('should not throw error for valid invitation', async () => {
      const res = await request(app)
        .post(`/api/invitations/validate`)
        .send({ token: pendingInvitation.token })
        .set('Accept', 'application/json');

      assert(res.body.data);
    });

    it('should return validated invitation for valid invitation', async () => {
      const res = await request(app)
        .post(`/api/invitations/validate`)
        .send({ token: pendingInvitation.token })
        .set('Accept', 'application/json');

      const pendingInviObj = pendingInvitation.toObject();
      expect(res.body.data).to.deep.include({
        ...pendingInviObj,
        sender: String(pendingInviObj.sender),
        expiryDate: pendingInviObj.expiryDate.toISOString(),
        _id: String(pendingInviObj._id),
        createdAt: pendingInviObj.createdAt.toISOString(),
        updatedAt: pendingInviObj.updatedAt.toISOString(),
      });
    });
  });
});
