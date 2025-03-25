import mongoose, { Document } from 'mongoose';

enum InvitationStatus {
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  REVOKED = 'REVOKED',
}

interface IInvitation extends Document {
  receiverEmail: string;
  sender: mongoose.Schema.Types.ObjectId;
  token: string;
  expiryDate: Date;
  status: InvitationStatus;
}

const InvitationSchema = new mongoose.Schema<IInvitation>(
  {
    receiverEmail: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InvitationStatus),
      required: true,
      default: InvitationStatus.PENDING,
    },
  },
  { timestamps: true }
);

const InvitationModel = new mongoose.Model('Invitation', InvitationSchema);

export default InvitationModel;
