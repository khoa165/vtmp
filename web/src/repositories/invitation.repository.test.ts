import { expect } from 'chai';
import { add, differenceInSeconds } from 'date-fns';

import assert from 'assert';

import { IInvitation } from '@/models/invitation.model';
import { IUser } from '@/models/user.model';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { useMongoDB } from '@/testutils/mongo-db.testutil';
import { getNewMongoId } from '@/testutils/mongo-id.testutil';
import { InvitationStatus } from '@vtmp/common/constants';

describe('InvitationRepository', () => {
  useMongoDB();
  const nextDay = add(Date.now(), { days: 1 });

  const mockMultipleInvitations = [
    {
      receiverEmail: 'mentee1@viettech.com',
      token: 'this is the token',
      expiryDate: nextDay,
    },

    {
      receiverEmail: 'mentee2@viettech.com',
      token: 'this is the token',
      expiryDate: nextDay,
    },

    {
      receiverEmail: 'mentee3@viettech.com',
      token: 'this is the token',
      expiryDate: nextDay,
    },
  ];

  const mockOneInvitation = {
    receiverEmail: 'mentee@viettech.com',
    token: 'this is the token',
    expiryDate: nextDay,
  };

  const mockOneAdmin = {
    firstName: 'admin',
    lastName: 'viettech',
    email: 'test@example.com',
    encryptedPassword: 'ecnrypted-password-later',
  };
  let admin: IUser;

  beforeEach(async () => {
    admin = await UserRepository.createUser(mockOneAdmin);
  });

  const checkInvitation = (
    invitation: IInvitation,
    actualInvitation: {
      receiverEmail: string;
      token: string;
      status: InvitationStatus;
      expiryDate: Date;
    }
  ) => {
    expect(invitation).to.include({
      receiverEmail: actualInvitation.receiverEmail,
      token: actualInvitation.token,
      status: actualInvitation.status,
    });
    const timeDiff = Math.abs(
      differenceInSeconds(actualInvitation.expiryDate, invitation.expiryDate)
    );

    expect(timeDiff).to.lessThan(3);
  };

  describe('createInvitation', () => {
    it('should create an invitation', async () => {
      const invitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        sender: admin.id,
      });

      checkInvitation(invitation, {
        ...mockOneInvitation,
        status: InvitationStatus.PENDING,
      });
    });
  });

  describe('getInvitationsWithFilter', () => {
    describe('when no filter is provided', () => {
      it('should return an empty array when no invitation exists', async () => {
        const invitations = await InvitationRepository.getInvitationsWithFilter(
          {}
        );
        expect(invitations).to.be.an('array').that.have.lengthOf(0);
      });

      it('should return an array of all invitations', async () => {
        await Promise.all(
          mockMultipleInvitations.map((invitation) =>
            InvitationRepository.createInvitation({
              ...invitation,
              sender: admin.id,
            })
          )
        );

        const invitations = await InvitationRepository.getInvitationsWithFilter(
          {}
        );
        expect(invitations)
          .to.be.an('array')
          .that.have.lengthOf(mockMultipleInvitations.length);
        expect(
          invitations.map((invitation) => invitation.receiverEmail)
        ).to.have.members(
          mockMultipleInvitations.map((invitation) => invitation.receiverEmail)
        );
      });
    });
    describe('when filter is provided', () => {
      let invitation: IInvitation;

      beforeEach(async () => {
        invitation = await InvitationRepository.createInvitation({
          ...mockOneInvitation,
          sender: admin.id,
        });
      });

      it('should return an empty array if cannot get any invitation with given receiver email', async () => {
        const invitationFoundByEmail =
          await InvitationRepository.getInvitationsWithFilter({
            receiverEmail: 'fake@example.com',
            status: InvitationStatus.PENDING,
          });
        expect(invitationFoundByEmail).to.be.an('array').that.have.lengthOf(0);
      });

      it('should return an array with only 1 pending invitation associated with an email', async () => {
        const invitationFoundByEmail =
          await InvitationRepository.getInvitationsWithFilter({
            receiverEmail: invitation.receiverEmail,
            status: InvitationStatus.PENDING,
          });

        expect(invitationFoundByEmail).to.be.an('array').that.have.lengthOf(1);
        invitationFoundByEmail.map((invitation) => {
          checkInvitation(invitation, {
            ...mockOneInvitation,
            status: InvitationStatus.PENDING,
          });
        });
      });

      it('should return an array of multiple pending invitations associated with an email', async () => {
        await InvitationRepository.createInvitation({
          ...mockOneInvitation,
          sender: admin.id,
        });

        const invitationFoundByEmail =
          await InvitationRepository.getInvitationsWithFilter({
            receiverEmail: invitation.receiverEmail,
            status: InvitationStatus.PENDING,
          });

        expect(invitationFoundByEmail).to.be.an('array').that.have.lengthOf(2);
        invitationFoundByEmail.map((invitation) => {
          checkInvitation(invitation, {
            ...mockOneInvitation,
            status: InvitationStatus.PENDING,
          });
        });
      });
    });
  });

  describe('getInvitationById', () => {
    let invitation: IInvitation;

    beforeEach(async () => {
      invitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        sender: admin.id,
      });
    });

    it('should return null if cannot get invitation with given id', async () => {
      const invitationFoundById =
        await InvitationRepository.getInvitationById(getNewMongoId());
      assert(!invitationFoundById);
    });

    it('should succeed to retrieve invitation by id', async () => {
      const invitationFoundById = await InvitationRepository.getInvitationById(
        invitation.id
      );

      assert(invitationFoundById);
      checkInvitation(invitationFoundById, {
        ...mockOneInvitation,
        status: InvitationStatus.PENDING,
      });
    });
  });

  describe('updateInvitationById', () => {
    let invitation: IInvitation;

    beforeEach(async () => {
      invitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        sender: admin.id,
      });
    });

    it('should return null if no invitation found with given id', async () => {
      const updatedInvitation = await InvitationRepository.updateInvitationById(
        getNewMongoId(),
        {}
      );
      assert(!updatedInvitation);
    });

    it('should return updated invitation if invitation found', async () => {
      const newExpiryDate = add(Date.now(), { days: 2 });
      const updatedInvitationInfo = {
        status: InvitationStatus.ACCEPTED,
        expiryDate: newExpiryDate,
      };

      const updatedInvitation = await InvitationRepository.updateInvitationById(
        invitation.id,
        updatedInvitationInfo
      );

      assert(updatedInvitation);
      checkInvitation(updatedInvitation, {
        ...mockOneInvitation,
        status: InvitationStatus.ACCEPTED,
        expiryDate: newExpiryDate,
      });
    });
  });
});
