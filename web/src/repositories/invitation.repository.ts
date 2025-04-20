import InvitationModel from '@/models/invitation.model';
import { IInvitation } from '@/models/invitation.model';
import { InvitationStatus } from '@common/enums';

const InvitationRepository = {
  createInvitation: async (invitationData: {
    receiverEmail: string;
    sender: string;
    token: string;
    expiryDate: Date;
    status?: InvitationStatus;
  }): Promise<IInvitation> => {
    return InvitationModel.create(invitationData);
  },

  getAllInvitations: async (): Promise<IInvitation[]> => {
    return InvitationModel.find();
  },

  getInvitationsByReceiverEmailAndStatus: async (
    email: string,
    status: InvitationStatus
  ): Promise<IInvitation[]> => {
    return InvitationModel.find({ receiverEmail: email, status }).sort(
      'createdAt'
    );
  },

  getInvitationById: async (
    invitationId: string
  ): Promise<IInvitation | null> => {
    return InvitationModel.findOne({ _id: invitationId });
  },

  updateInvitationById: async (
    invitationId: string,
    updateInvitationInfo: {
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

export default InvitationRepository;
