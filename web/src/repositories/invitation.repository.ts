import InvitationModel, { IInvitation } from '@/models/invitation.model';
import { InvitationStatus } from '@common/enums';

export const InvitationRepository = {
  getAllPendingInvitations: async (): Promise<IInvitation> => {
    return InvitationModel.find({ status: InvitationStatus.PENDING });
  },

  getInvitationById: async (
    invitationId: string
  ): Promise<IInvitation | null> => {
    return InvitationModel.findOne({ _id: invitationId });
  },

  getInvitationByReceiverEmail: async (
    receiverEmail: string
  ): Promise<IInvitation | null> => {
    return InvitationModel.findOne({ receiverEmail });
  },

  createInvitation: async (invitationData: {
    receiverEmail: string;
    sender: string;
    token: string;
    expiryDate: Date;
    status: InvitationStatus;
  }): Promise<IInvitation | null> => {
    return InvitationModel.create(invitationData);
  },

  updateInvitaionById: async (
    invitationId: string,
    updateInvitationInfo: {
      receiverEmail?: string;
      sender?: string;
      token?: string;
      expiryDate?: Date;
      status?: InvitationStatus;
    }
  ): Promise<IInvitation | null> => {
    return InvitationModel.findOneAndUpdate(
      { _id: invitationId },
      updateInvitationInfo,
      { new: true }
    );
  },
};
