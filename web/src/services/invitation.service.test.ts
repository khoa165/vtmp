import { EnvConfig } from '@/config/env';
import { IInvitation } from '@/models/invitation.model';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { InvitationService } from '@/services/invitation.service';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, toMongoId } from '@/testutils/mongoID.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import {
  DuplicateResourceError,
  ForbiddenError,
  InternalServerError,
  ResourceNotFoundError,
} from '@/utils/errors';
import { InvitationStatus } from '@vtmp/common/constants';
import assert from 'assert';
import { expect } from 'chai';
import { addDays, differenceInSeconds, subDays } from 'date-fns';
import jwt from 'jsonwebtoken';
import { describe } from 'mocha';
import * as R from 'remeda';
import sinon from 'sinon';
import { emailService } from '@/utils/email';

describe('InvitationService', () => {
  useMongoDB();
  const sandbox = useSandbox();

  const nextWeek = addDays(Date.now(), 7);
  const mockMenteeName = 'Mentee Viettech';
  const mockAdminId = getNewMongoId();

  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    const sendEmailStub = sinon
      .stub(emailService, 'sendEmail')
      .callsFake(async () => {
        expect(sendEmailStub.calledOnce).to.equal(true);
      });
  });

  afterEach(() => {
    sinon.restore();
  });

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

  describe('getAllInvitations', () => {
    it('should return empty array when no invitations exist', async () => {
      const invitations = await InvitationService.getAllInvitations();
      expect(invitations).to.be.an('array');
      expect(invitations).to.have.lengthOf(0);
    });

    it('should return all invitations', async () => {
      await Promise.all(
        mockMultipleInvitations.map((mockInvitation) =>
          InvitationRepository.createInvitation(mockInvitation)
        )
      );

      const invitations = await InvitationService.getAllInvitations();
      expect(invitations)
        .to.be.an('array')
        .that.have.lengthOf(mockMultipleInvitations.length);
    });
  });

  describe.only('sendInvitation', () => {
    it('should return error message when user associated with invitation receiver email already exists', async () => {
      const mockUser = {
        firstName: 'Admin',
        lastName: 'Viettech',
        email: 'test@example.com',
        encryptedPassword: 'encrypted-password-later',
      };
      await UserRepository.createUser(mockUser);

      await expect(
        InvitationService.sendInvitation(
          `${mockUser.firstName} ${mockUser.lastName}`,
          mockUser.email,
          mockAdminId
        )
      ).eventually.rejectedWith(
        DuplicateResourceError,
        'User associated with this email already has an account'
      );
    });

    it('should return error message for user associated with invitation receiver email has already accepted the invitation but no account found', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        status: InvitationStatus.ACCEPTED,
      });

      await expect(
        InvitationService.sendInvitation(
          mockMenteeName,
          mockOneInvitation.receiverEmail,
          mockAdminId
        )
      ).eventually.rejectedWith(
        InternalServerError,
        'User associated with this email has already accepted the invitation'
      );
    });

    it('should not throw error and return null when a Pending invitation associated with receiver email exists', async () => {
      await InvitationRepository.createInvitation(mockOneInvitation);
      await expect(
        InvitationService.sendInvitation(
          mockMenteeName,
          mockOneInvitation.receiverEmail,
          mockAdminId
        )
      ).eventually.fulfilled.and.to.be.null;
    });

    it('should not throw error and return null when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: subDays(Date.now(), 2),
      });
      await expect(
        InvitationService.sendInvitation(
          mockMenteeName,
          mockOneInvitation.receiverEmail,
          mockAdminId
        )
      ).eventually.fulfilled.and.to.be.null;
    });

    it('should update invitation to new expiry date when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      const expiredInvitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: subDays(Date.now(), 2),
      });
      await InvitationService.sendInvitation(
        mockMenteeName,
        mockOneInvitation.receiverEmail,
        mockAdminId
      );

      const invitationWithNewExpiryDate =
        await InvitationRepository.getInvitationById(expiredInvitation.id);
      assert(invitationWithNewExpiryDate);
      expect(invitationWithNewExpiryDate.toObject()).to.deep.include(
        R.omit({ ...mockOneInvitation, sender: toMongoId(mockAdminId) }, [
          'expiryDate',
        ])
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
      await expect(
        InvitationService.sendInvitation(
          mockMenteeName,
          mockOneInvitation.receiverEmail,
          mockAdminId
        )
      ).eventually.fulfilled;
    });

    it('should return newly created invitation when no Pending invitations associated with receiver email exist', async () => {
      const createdInvitation = await InvitationService.sendInvitation(
        mockMenteeName,
        mockOneInvitation.receiverEmail,
        mockAdminId
      );

      assert(createdInvitation);
      expect(createdInvitation).to.deep.include({
        receiverEmail: mockOneInvitation.receiverEmail,
        sender: toMongoId(mockAdminId),
        status: InvitationStatus.PENDING,
      });
    });
  });

  describe('revokeInvitation', () => {
    it('should return error message when invitation does not exist', async () => {
      await expect(
        InvitationService.revokeInvitation(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError, 'Invitation not found');
    });

    it('should return error message when invitation is not pending', async () => {
      const newInvitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        status: InvitationStatus.ACCEPTED,
      });
      await expect(
        InvitationService.revokeInvitation(newInvitation.id)
      ).eventually.rejectedWith(
        ForbiddenError,
        'Can only revoke Pending invitation'
      );
    });

    it('should successfully revoke invitation', async () => {
      const newInvitation =
        await InvitationRepository.createInvitation(mockOneInvitation);
      await expect(InvitationService.revokeInvitation(newInvitation.id))
        .eventually.fulfilled;
    });

    it('should successfully revoke invitation and return the invitation with updated status of REVOKED', async () => {
      const newInvitation =
        await InvitationRepository.createInvitation(mockOneInvitation);

      const revokedInvitation = await InvitationService.revokeInvitation(
        newInvitation.id
      );

      assert(revokedInvitation);
      expect(revokedInvitation).to.deep.include({
        ...mockOneInvitation,
        sender: toMongoId(mockOneInvitation.sender),
      });
      expect(revokedInvitation.status).to.equal(InvitationStatus.REVOKED);
    });
  });

  describe('validateInvitation', () => {
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
      await expect(
        InvitationService.validateInvitation('invalid-token')
      ).eventually.rejectedWith(jwt.JsonWebTokenError);
    });

    it('should return error message for invitation not found', async () => {
      const invalidToken = jwt.sign(
        { receiverEmail: 'not-found-email@viettech.com' },
        EnvConfig.get().JWT_SECRET,
        { expiresIn: '7d' }
      );
      await expect(
        InvitationService.validateInvitation(invalidToken)
      ).eventually.rejectedWith(ResourceNotFoundError, 'Invitation not found');
    });

    it('should return error message for invitation has expired', async () => {
      await InvitationRepository.updateInvitationById(pendingInvitation.id, {
        expiryDate: subDays(Date.now(), 1),
      });
      await expect(
        InvitationService.validateInvitation(pendingInvitation.token)
      ).eventually.rejectedWith(ForbiddenError, 'Invitation has expired');
    });

    it('should not throw error for valid invitation', async () => {
      await expect(
        InvitationService.validateInvitation(pendingInvitation.token)
      ).eventually.fulfilled;
    });

    it('should return validated invitation for valid invitation', async () => {
      const validatedInvitation = await InvitationService.validateInvitation(
        pendingInvitation.token
      );

      expect(validatedInvitation).to.deep.include(pendingInvitation.toObject());
    });
  });
});
