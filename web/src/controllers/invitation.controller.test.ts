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
import { InvitationStatus } from '@vtmp/common/constants';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { addDays, subDays } from 'date-fns';
import { InvitationRepository } from '@/repositories/invitation.repository';
import assert from 'assert';
import jwt from 'jsonwebtoken';
import { IInvitation } from '@/models/invitation.model';
import * as R from 'remeda';
import { differenceInSeconds } from 'date-fns/fp/differenceInSeconds';

describe('InvitationController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  const nextWeek = addDays(Date.now(), 7);
  const mockMenteeName = 'Mentee Viettech';
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
    it('should return error for missing receiverName', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Receiver Email is required');
    });

    it('should return error for missing receiverEmail', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: 'Admin',
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Email is required');
    });

    it('should return error for missing senderId', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: 'Admin',
          receiverEmail: mockOneInvitation.receiverEmail,
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('SenderId is required');
    });

    it('should return error message when user associated with invitation receiver email already exists', async () => {
      const mockUser = {
        firstName: 'Admin',
        lastName: 'Viettech',
        email: 'test@example.com',
        encryptedPassword: 'encrypted-password-later',
      };
      await UserRepository.createUser(mockUser);

      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: `${mockUser.firstName} ${mockUser.lastName}`,
          receiverEmail: mockUser.email,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq(
        'User associated with this email already has an account'
      );
    });

    it('should return error message for user associated with invitation receiver email has already accepted the invitation but no account found', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        status: InvitationStatus.ACCEPTED,
      });

      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 500, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq(
        'User associated with this email has already accepted the invitation'
      );
    });

    it('should not throw error and return null when a Pending invitation associated with receiver email exists', async () => {
      await InvitationRepository.createInvitation(mockOneInvitation);
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      expect(res.body.data).to.be.eql(null);
    });

    it('should not throw error and return null when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: subDays(Date.now(), 2),
      });

      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      expect(res.body.data).to.be.eql(null);
    });

    it('should update invitation to new expiry date when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      const expiredInvitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: subDays(Date.now(), 2),
      });

      await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      const invitationWithNewExpiryDate =
        await InvitationRepository.getInvitationById(expiredInvitation.id);
      assert(invitationWithNewExpiryDate);
      expect(invitationWithNewExpiryDate.toObject()).to.deep.include(
        R.omit({ ...mockOneInvitation }, ['expiryDate', 'sender'])
      );
      expect(String(invitationWithNewExpiryDate.toObject().sender)).to.eq(
        mockAdminId
      );

      const timeDiff = Math.abs(
        differenceInSeconds(
          invitationWithNewExpiryDate.expiryDate,
          addDays(Date.now(), 7)
        )
      );
      expect(timeDiff).to.lessThan(3);
    });

    it('should not throw error when no Pending invitations associated with receiver email exist', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      assert(res.body);
    });

    it('should return newly created invitation when no Pending invitations associated with receiver email exist', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json');

      assert(res.body);
      expect(res.body.data).to.deep.include({
        receiverEmail: mockOneInvitation.receiverEmail,
        status: InvitationStatus.PENDING,
      });

      expect(String(res.body.data.sender)).to.eq(mockAdminId);
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

    it('should return error for missing token', async () => {
      const res = await request(app)
        .post(`/api/invitations/validate`)
        .send({ token: '' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('jwt must be provided');
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
