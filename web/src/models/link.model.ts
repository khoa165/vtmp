import mongoose, { Schema, Types } from 'mongoose';
import { LinkStatus } from '@/types/enums';

interface ILink extends Document {
  url: string;
  status?: LinkStatus;
  submittedOn: Date;
  submittedBy?: Types.ObjectId;
  companyName?: String;
  userNote?: string;
}

const LinkSchema = new mongoose.Schema<ILink>(
  {
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LinkStatus),
      default: LinkStatus.PENDING,
    },
    submittedOn: {
      type: Date,
      default: Date.now,
    },

    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    companyName: {
      type: String,
    },
    userNote: {
      type: String,
    },
  },
  { timestamps: true }
);

export const LinkModel = mongoose.model<ILink>('Link', LinkSchema);
