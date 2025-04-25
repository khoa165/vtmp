import { EnvConfig } from '@/config/env';
import { IInvitation } from '@/models/invitation.model';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { UserRepository } from '@/repositories/user.repository';
import { EmailService } from '@/utils/email';
import {
  DuplicateResourceError,
  ForbiddenError,
  InternalServerError,
  ResourceNotFoundError,
} from '@/utils/errors';
import { InvitationStatus } from '@common/enums';
import { addDays, isBefore } from 'date-fns';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const DecodedJWTSchema = z.object({
  receiverEmail: z.string().email(),
});

export const InvitationService = {
  getAllInvitations: async () => {
    return InvitationRepository.getInvitationsWithFilter({});
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

    const [latestPendingInvitation] =
      await InvitationRepository.getInvitationsWithFilter({
        receiverEmail,
        status: InvitationStatus.PENDING,
      });

    if (!latestPendingInvitation) {
      token = jwt.sign({ receiverEmail }, EnvConfig.get().JWT_SECRET, {
        expiresIn: '1d',
      });

      newInvitation = await InvitationRepository.createInvitation({
        receiverEmail,
        sender: senderId,
        token,
        expiryDate: addDays(Date.now(), 1),
      });
    } else {
      if (isBefore(latestPendingInvitation.expiryDate, Date.now())) {
        await InvitationRepository.updateInvitationById(
          latestPendingInvitation.id,
          { expiryDate: addDays(Date.now(), 1) }
        );
      }

      token = latestPendingInvitation.token;
    }

    const emailTemplate = EmailService.getInvitationEmailTemplate(
      receiverName,
      receiverEmail,
      token
    );
    await EmailService.sendEmail(emailTemplate);
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
