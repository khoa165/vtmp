import mongoose, { Schema } from 'mongoose';

import { InvitationStatus } from '@vtmp/common/constants';

import { IInvitation } from '@/types/entities';

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
