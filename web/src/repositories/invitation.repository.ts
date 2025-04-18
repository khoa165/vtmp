import InvitationModel from '@/models/invitation.model';
import { IInvitation } from '@/models/invitation.model';
import { InvitationStatus } from '@common/enums';
import mongoose from 'mongoose';

const InvitationRepository = {
  createInvitation: async (invitationData: {
    receiverEmail: string;
    sender: mongoose.Schema.Types.ObjectId;
    token: string;
    expiryDate: Date;
    status?: InvitationStatus;
  }): Promise<IInvitation> => {
    return InvitationModel.create(invitationData);
  },

  getAllInvitations: async (): Promise<IInvitation[]> => {
    return InvitationModel.find();
  },

  getInvitationByReceiverEmail: async (
    email: string
  ): Promise<IInvitation[]> => {
    return InvitationModel.find({ receiverEmail: email });
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
