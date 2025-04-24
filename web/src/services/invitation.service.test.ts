import { EnvConfig } from '@/config/env';
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
  ResourceNotFoundError,
} from '@/utils/errors';
import { InvitationStatus } from '@common/enums';
import assert from 'assert';
import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import { describe } from 'mocha';
import * as R from 'remeda';

describe('InvitationService', () => {
  useMongoDB();
  const sandbox = useSandbox();

  const mockAdminId = getNewMongoId();

  const mockOneInvitation = {
    receiverEmail: 'mentee@viettech.com',
    sender: mockAdminId,
    token: 'token-for-invitation',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  const mockMultipleInvitations = [
    {
      receiverEmail: 'mentee1@viettech.com',
      sender: mockAdminId,
      token: 'token-for-invitation',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },

    {
      receiverEmail: 'mentee2@viettech.com',
      sender: mockAdminId,
      token: 'token-for-invitation',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },

    {
      receiverEmail: 'mentee3@viettech.com',
      sender: mockAdminId,
      token: 'token-for-invitation',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ];

  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

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

  describe('sendInvitation', () => {
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

    it('should not throw error and return null when a Pending invitation associated with receiver email exists', async () => {
      const newInvitation =
        await InvitationRepository.createInvitation(mockOneInvitation);
      await expect(
        InvitationService.sendInvitation(
          'Mentee',
          newInvitation.receiverEmail,
          mockAdminId
        )
      ).eventually.fulfilled.and.to.be.null;
    });

    it('should not throw error and return null when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
      await expect(
        InvitationService.sendInvitation(
          'Mentee',
          'mentee@viettech.com',
          mockAdminId
        )
      ).eventually.fulfilled.and.to.be.null;
    });

    it('should update invitation to new expiry date when a Pending invitation associated with receiver email exists but pass expiry date', async () => {
      const expiredInvitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
      await InvitationService.sendInvitation(
        'Mentee',
        'mentee@viettech.com',
        mockAdminId
      );

      const invitationWithNewExpiryDate =
        await InvitationRepository.getInvitationById(expiredInvitation.id);
      assert(invitationWithNewExpiryDate);
      expect(invitationWithNewExpiryDate.toObject()).to.containSubset(
        R.omit({ ...mockOneInvitation, sender: toMongoId(mockAdminId) }, [
          'expiryDate',
        ])
      );

      const timeDiff = Math.abs(
        differenceInSeconds(
          invitationWithNewExpiryDate.expiryDate,
          new Date(Date.now() + 24 * 60 * 60 * 1000)
        )
      );
      expect(timeDiff).to.lessThan(3);
    });

    it('should not throw error when no Pending invitations associated with receiver email exist', async () => {
      await expect(
        InvitationService.sendInvitation(
          'Mentee',
          'mentee@viettech.com',
          mockAdminId
        )
      ).eventually.fulfilled;
    });

    it('should return newly created invitation when no Pending invitations associated with receiver email exist', async () => {
      const createdInvitation = await InvitationService.sendInvitation(
        'Mentee',
        'mentee@viettech.com',
        mockAdminId
      );

      assert(createdInvitation);
      expect(createdInvitation).to.containSubset({
        receiverEmail: 'mentee@viettech.com',
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
      expect(revokedInvitation).to.containSubset({
        ...mockOneInvitation,
        sender: toMongoId(mockOneInvitation.sender),
      });
      expect(revokedInvitation.status).to.equal(InvitationStatus.REVOKED);
    });
  });
});
