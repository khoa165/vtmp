import { addDays, isBefore } from 'date-fns';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { InvitationStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { IInvitation } from '@/models/invitation.model';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { getEmailService } from '@/utils/email';
import {
  DuplicateResourceError,
  ForbiddenError,
  InternalServerError,
  ResourceNotFoundError,
} from '@/utils/errors';

const DecodedJWTSchema = z.object({
  receiverEmail: z.string().email(),
});

export const InvitationService = {
  getAllInvitations: async (): Promise<IInvitation[]> => {
    return InvitationRepository.getInvitationsWithFilter({});
  },

  sendInvitation: async (
    receiverName: string,
    receiverEmail: string,
    senderId: string
  ): Promise<IInvitation | null> => {
    const foundUser = await UserRepository.getUserByEmail(receiverEmail);
    if (foundUser) {
      throw new DuplicateResourceError(
        'User associated with this email already has an account',
        { receiverEmail }
      );
    }

    const foundAcceptedInvitation =
      await InvitationRepository.getInvitationsWithFilter({
        receiverEmail,
        status: InvitationStatus.ACCEPTED,
      });
    if (foundAcceptedInvitation.length > 0) {
      throw new InternalServerError(
        'User associated with this email has already accepted the invitation',
        { receiverEmail, foundAcceptedInvitation }
      );
    }

    let newInvitation: IInvitation | null = null;
    let token: string;
    let latestPendingInvitation: IInvitation | null = null;

    const pendingInvitations =
      await InvitationRepository.getInvitationsWithFilter({
        receiverEmail,
        status: InvitationStatus.PENDING,
      });
    latestPendingInvitation = pendingInvitations[0] ?? null;

    if (!latestPendingInvitation) {
      token = jwt.sign({ receiverEmail }, EnvConfig.get().JWT_SECRET, {
        expiresIn: '7d',
      });

      newInvitation = await InvitationRepository.createInvitation({
        receiverEmail,
        receiverName,
        sender: senderId,
        token,
        expiryDate: addDays(Date.now(), 7),
      });
    } else {
      if (isBefore(latestPendingInvitation.expiryDate, Date.now())) {
        const updatedInvitation =
          await InvitationRepository.updateInvitationById(
            latestPendingInvitation.id,
            { expiryDate: addDays(Date.now(), 7) }
          );
        if (updatedInvitation) {
          latestPendingInvitation = updatedInvitation;
        }
      }

      token = latestPendingInvitation.token;
    }

    const emailTemplate = getEmailService().getInvitationEmailTemplate(
      receiverName,
      receiverEmail,
      token
    );
    await getEmailService().sendEmail(emailTemplate);
    return newInvitation || latestPendingInvitation;
  },

  updateInvitation: async (
    invitationId: string,
    updateInvitationInfo: {
      status?: InvitationStatus;
      expiryDate?: Date;
    }
  ): Promise<IInvitation | null> => {
    return InvitationRepository.updateInvitationById(
      invitationId,
      updateInvitationInfo
    );
  },

  revokeInvitation: async (
    invitationId: string
  ): Promise<IInvitation | null> => {
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

  validateInvitation: async (token: string) => {
    const decodedToken = jwt.verify(token, EnvConfig.get().JWT_SECRET);
    const { receiverEmail } = DecodedJWTSchema.parse(decodedToken);

    const [foundInvitation] =
      await InvitationRepository.getInvitationsWithFilter({
        receiverEmail,
        status: InvitationStatus.PENDING,
      });

    if (!foundInvitation) {
      throw new ResourceNotFoundError('Invitation not found', {
        token,
        receiverEmail,
      });
    }

    if (isBefore(foundInvitation.expiryDate, Date.now())) {
      throw new ForbiddenError('Invitation has expired', {
        token,
        receiverEmail,
      });
    }

    return foundInvitation;
  },
};
