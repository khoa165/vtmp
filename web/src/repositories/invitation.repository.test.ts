import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import InvitationRepository from '@/repositories/invitation.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { UserRepository } from '@/repositories/user.repository';
import { IUser } from '@/models/user.model';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { InvitationStatus } from '@/types/enums';
import { differenceInSeconds } from 'date-fns';
import assert from 'assert';
import { IInvitation } from '@/models/invitation.model';
import { getNewMongoId } from '@/testutils/mongoID.testutil';

chai.use(chaiSubset);
const { expect } = chai;
describe('InvitationRepository', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  const mockMultipleInvitations = [
    {
      receiverEmail: 'mentee1@viettech.com',
      token: 'this is the token',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },

    {
      receiverEmail: 'mentee2@viettech.com',
      token: 'this is the token',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },

    {
      receiverEmail: 'mentee3@viettech.com',
      token: 'this is the token',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ];

  const mockOneInvitation = {
    receiverEmail: 'mentee@viettech.com',
    token: 'this is the token',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
    expect(invitation.toObject()).to.include({
      receiverEmail: actualInvitation.receiverEmail,
      token: actualInvitation.token,
      status: actualInvitation.status,
    });
    const timeDiff = differenceInSeconds(
      actualInvitation.expiryDate,
      invitation.expiryDate
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

  describe('getAllInvitation', () => {
    it('should return an empty array when no invitation', async () => {
      const invitations = await InvitationRepository.getAllInvitations();
      expect(invitations).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an array of all users', async () => {
      await Promise.all(
        mockMultipleInvitations.map((invitation) =>
          InvitationRepository.createInvitation({
            ...invitation,
            sender: admin.id,
          })
        )
      );

      const invitations = await InvitationRepository.getAllInvitations();
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

  describe('getInvitationByEmail', () => {
    let invitation: IInvitation;

    beforeEach(async () => {
      invitation = await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        sender: admin.id,
      });
    });

    it('should return an empty array if cannot get any invitation with given receiver email', async () => {
      const invitationFoundByEmail =
        await InvitationRepository.getInvitationByReceiverEmail(
          'fake@example.com'
        );
      expect(invitationFoundByEmail).to.be.an('array').to.have.lengthOf(0);
    });

    it('should return an array with only 1 invitation found', async () => {
      const invitationFoundByEmail =
        await InvitationRepository.getInvitationByReceiverEmail(
          invitation.receiverEmail
        );

      expect(invitationFoundByEmail).to.be.an('array').to.have.lengthOf(1);
      invitationFoundByEmail.map((invitation) => {
        checkInvitation(invitation, {
          ...mockOneInvitation,
          status: InvitationStatus.PENDING,
        });
      });
    });

    it('should return an array of multiple invitations sent to an email', async () => {
      await InvitationRepository.createInvitation({
        ...mockOneInvitation,
        sender: admin.id,
      });

      const invitationFoundByEmail =
        await InvitationRepository.getInvitationByReceiverEmail(
          invitation.receiverEmail
        );

      expect(invitationFoundByEmail).to.be.an('array').to.have.lengthOf(2);

      invitationFoundByEmail.map((invitation) => {
        checkInvitation(invitation, {
          ...mockOneInvitation,
          status: InvitationStatus.PENDING,
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
      const updatedInvitationInfo = {
        status: InvitationStatus.ACCEPTED,
      };

      const updatedInvitation = await InvitationRepository.updateInvitationById(
        invitation.id,
        updatedInvitationInfo
      );

      assert(updatedInvitation);
      checkInvitation(updatedInvitation, {
        ...mockOneInvitation,
        status: InvitationStatus.ACCEPTED,
      });
    });
  });
});
