import { EnvConfig } from '@/config/env';
import { IInvitation } from '@/models/invitation.model';
import InvitationRepository from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { sendEmail, getInvitationEmailTemplate } from '@/utils/emai';
import {
  DuplicateResourceError,
  ForbiddenError,
  ResourceNotFoundError,
} from '@/utils/errors';
import { InvitationStatus } from '@common/enums';
import { differenceInSeconds } from 'date-fns';
import jwt from 'jsonwebtoken';

const config = EnvConfig.get();
export const InvitationService = {
  getAllInvitations: async () => {
    return InvitationRepository.getAllInvitations();
  },

  sendInvitation: async (
    receiverName: string,
    receiverEmail: string,
    senderId: string
  ) => {
    const foundUser = await UserRepository.getUserByEmail(receiverEmail);
    if (foundUser) {
      throw new DuplicateResourceError(
        'User associated with this email already has an account',
        { receiverEmail }
      );
    }

    const foundAcceptedInvitation =
      await InvitationRepository.getInvitationsByReceiverEmailAndStatus(
        receiverEmail,
        InvitationStatus.ACCEPTED
      );
    if (foundAcceptedInvitation.length > 0) {
      throw new Error(
        'User associated with this email has already accepted the invitation'
      );
    }

    let newInvitation: IInvitation | null = null;
    let token: string;

    const [lastestPendingInvitation] =
      await InvitationRepository.getInvitationsByReceiverEmailAndStatus(
        receiverEmail,
        InvitationStatus.PENDING
      );

    if (!lastestPendingInvitation) {
      token = jwt.sign({ receiverEmail }, config.JWT_SECRET, {
        expiresIn: '1d',
      });

      newInvitation = await InvitationRepository.createInvitation({
        receiverEmail,
        sender: senderId,
        token,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    } else {
      const timeDifferenceInSeconds = Math.abs(
        differenceInSeconds(lastestPendingInvitation.expiryDate, Date.now())
      );

      if (timeDifferenceInSeconds > 24 * 60 * 60) {
        await InvitationRepository.updateInvitationById(
          lastestPendingInvitation.id,
          { expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }
        );
      }

      token = lastestPendingInvitation.token;
    }

    const emailTemplate = getInvitationEmailTemplate(
      receiverName,
      receiverEmail,
      token
    );
    await sendEmail(emailTemplate);
    return newInvitation;
  },

  revokeInvitation: async (invitationId: string) => {
    const foundInvitation =
      await InvitationRepository.getInvitationById(invitationId);

    if (!foundInvitation) {
      throw new ResourceNotFoundError('Invitation not found', { invitationId });
    } else if (foundInvitation.status !== InvitationStatus.PENDING) {
      throw new ForbiddenError('Can only revoke Pending invitation', {
        invitationId,
        foundInvitation,
      });
    }
    const revokedInvitation = await InvitationRepository.updateInvitationById(
      invitationId,
      { status: InvitationStatus.REVOKED }
    );

    return revokedInvitation;
  },
};
