import mongoose from 'mongoose';
import { LinkStatus } from '@common/enums';

interface ILink extends Document {
  url: string;
  status?: LinkStatus;
  submittedOn: Date;
  companyName?: string;
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
    companyName: {
      type: String,
    },
    userNote: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILink>('Link', LinkSchema);
