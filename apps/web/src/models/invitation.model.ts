import mongoose, { Document, Schema, Types } from 'mongoose';

import { InvitationStatus } from '@vtmp/common/constants';

export interface IInvitation extends Document {
  _id: Types.ObjectId;
  receiverEmail: string;
  receiverName: string;
  sender: Types.ObjectId;
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
    receiverName: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
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
      default: InvitationStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const InvitationModel = mongoose.model('Invitation', InvitationSchema);
