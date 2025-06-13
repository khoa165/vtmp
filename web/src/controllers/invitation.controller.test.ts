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
import jwt from 'jsonwebtoken';
import { IInvitation } from '@/models/invitation.model';
import { omit } from 'remeda';
import { differenceInSeconds } from 'date-fns/fp/differenceInSeconds';
import { getEmailService } from '@/utils/email';
import { SinonStub } from 'sinon';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
  runUserLogin,
} from '@/testutils/auth.testutils';

describe('InvitationController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let sendEmailStub: SinonStub;
  let mockUserToken: string, mockAdminToken: string, mockModeratorToken: string;

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    const emailService = getEmailService();
    sendEmailStub = sandbox.stub(emailService, 'sendEmail').resolves();

    ({ mockUserToken, mockAdminToken, mockModeratorToken } =
      await runUserLogin());
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
    runDefaultAuthMiddlewareTests({
      route: '/api/invitations',
      method: HTTPMethod.GET,
    });

    it('should throw ForbiddenError for retrieving invitations without corresponding permission', async () => {
      [mockUserToken, mockModeratorToken].map(async (token) => {
        const res = await request(app)
          .get('/api/invitations')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);

        expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
        expect(res.body.errors[0].message).to.equal('Forbidden');
      });
    });

    it('should return empty array when no invitations exist', async () => {
      const res = await request(app)
        .get('/api/invitations')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

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
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data)
        .to.be.an('array')
        .that.have.lengthOf(mockMultipleInvitations.length);

      expect(
        res.body.data.map((inv: IInvitation) => ({
          receiverEmail: inv.receiverEmail,
          sender: inv.sender,
          token: inv.token,
          expiryDate: new Date(inv.expiryDate),
        }))
      ).to.have.deep.members(mockMultipleInvitations);
    });
  });

  describe('POST /invitations', () => {
    runDefaultAuthMiddlewareTests({
      route: '/api/invitations',
      method: HTTPMethod.POST,
      body: {
        receiverName: mockMenteeName,
        receiverEmail: mockOneInvitation.receiverEmail,
        senderId: mockAdminId,
      },
    });

    it('should throw ForbiddenError for sending invitations without corresponding permission', async () => {
      [mockUserToken, mockModeratorToken].map(async (token) => {
        const res = await request(app)
          .post('/api/invitations')
          .send({
            receiverName: mockMenteeName,
            receiverEmail: mockOneInvitation.receiverEmail,
            senderId: mockAdminId,
          })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);

        expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
        expect(res.body.errors[0].message).to.equal('Forbidden');
      });
    });

    it('should return error for missing receiverName', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Receiver Name is required');
    });

    it('should return error for missing receiverEmail', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Receiver Email is required');
    });

    it('should return error for missing senderId', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('SenderId is required');
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
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
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
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 500, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'User associated with this email has already accepted the invitation'
      );
    });

    it('should update invitation to new expiry date and return updated invitation when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: subDays(Date.now(), 2),
      });
      const expectedExpiryDate = addDays(Date.now(), 7);

      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });

      expect(res.body.data).to.deep.include(
        omit(mockOneInvitation, ['expiryDate', 'sender'])
      );
      expect(String(res.body.data.sender)).to.equal(mockAdminId);

      const timeDiff = Math.abs(
        differenceInSeconds(res.body.data.expiryDate, expectedExpiryDate)
      );
      expect(timeDiff).to.lessThan(3);
      expect(sendEmailStub.calledOnce).to.equal(true);
    });

    it('should return newly created invitation when no Pending invitations associated with receiver email exist', async () => {
      const res = await request(app)
        .post('/api/invitations')
        .send({
          receiverName: mockMenteeName,
          receiverEmail: mockOneInvitation.receiverEmail,
          senderId: mockAdminId,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.include({
        receiverEmail: mockOneInvitation.receiverEmail,
        status: InvitationStatus.PENDING,
      });

      expect(String(res.body.data.sender)).to.equal(mockAdminId);
      expect(sendEmailStub.calledOnce).to.equal(true);
    });
  });

  describe('PUT /invitations/:invitationId/revoke', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/invitations/${getNewMongoId()}/revoke`,
      method: HTTPMethod.PUT,
    });

    it('should throw ForbiddenError for revoking invitations without corresponding permission', async () => {
      [mockUserToken, mockModeratorToken].map(async (token) => {
        const res = await request(app)
          .put(`/api/invitations/${getNewMongoId()}/revoke`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);

        expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
        expect(res.body.errors[0].message).to.eq('Forbidden');
      });
    });

    it('should return error message when invitation does not exist', async () => {
      const res = await request(app)
        .put(`/api/invitations/${getNewMongoId()}/revoke`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

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
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

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
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.include(
        omit(mockOneInvitation, ['expiryDate'])
      );

      const timeDiff = Math.abs(
        differenceInSeconds(
          res.body.data.expiryDate,
          mockOneInvitation.expiryDate
        )
      );

      expect(timeDiff).to.lessThan(3);
      expect(res.body.data.status).to.equal(InvitationStatus.REVOKED);
    });
  });

  describe('POST /auth/validate', () => {
    let pendingInvitation: IInvitation;
    let token: string;

    beforeEach(async () => {
      token = jwt.sign(
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
        .post(`/api/auth/validate`)
        .send({ token: '' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('jwt must be provided');
    });

    it('should return error message for invalid token', async () => {
      const res = await request(app)
        .post(`/api/auth/validate`)
        .send({ token: 'fake token' })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('jwt malformed');
    });

    it('should return error message for invitation not found', async () => {
      const invalidToken = jwt.sign(
        { receiverEmail: 'not-found-email@viettech.com' },
        EnvConfig.get().JWT_SECRET,
        { expiresIn: '7d' }
      );

      const res = await request(app)
        .post(`/api/auth/validate`)
        .send({ token: invalidToken })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invitation not found');
    });

    it('should return error message for invitation has expired', async () => {
      await InvitationRepository.updateInvitationById(pendingInvitation.id, {
        expiryDate: subDays(Date.now(), 1),
      });

      const res = await request(app)
        .post(`/api/auth/validate`)
        .send({ token: pendingInvitation.token })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invitation has expired');
    });

    it('should return validated invitation for valid invitation', async () => {
      const res = await request(app)
        .post(`/api/auth/validate`)
        .send({ token })
        .set('Accept', 'application/json');

      const { expiryDate, ...nonDateInvitation } = mockOneInvitation;
      const timeDiff = differenceInSeconds(
        res.body.data.expiryDate,
        expiryDate
      );

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.include({ ...nonDateInvitation, token });
      expect(timeDiff).to.lessThan(3);
    });
  });
});
