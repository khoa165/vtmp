import { InvitationModel } from '@/models/invitation.model';
import { IInvitation } from '@/models/invitation.model';
import { InvitationStatus } from '@common/enums';

export const InvitationRepository = {
  createInvitation: async (invitationData: {
    receiverEmail: string;
    sender: string;
    token: string;
    expiryDate: Date;
    status?: InvitationStatus;
  }): Promise<IInvitation> => {
    return InvitationModel.create(invitationData);
  },

  getInvitationsWithFilter: async (filter: {
    receiverEmail?: string;
    status?: InvitationStatus;
  }): Promise<IInvitation[]> => {
    return InvitationModel.find(filter).sort('-createdAt');
  },

  getInvitationById: async (
    invitationId: string
  ): Promise<IInvitation | null> => {
    return InvitationModel.findById(invitationId);
  },

  updateInvitationById: async (
    invitationId: string,
    updateInvitationInfo: {
      status?: InvitationStatus;
      expiryDate?: Date;
    }
  ): Promise<IInvitation | null> => {
    return InvitationModel.findOneAndUpdate(
      { _id: invitationId },
      updateInvitationInfo,
      { new: true }
    );
  },
};
