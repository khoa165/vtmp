import mongoose, { Document, Schema, Types } from 'mongoose';
import { JobPostingLocation, LinkStatus } from '@vtmp/common/constants';

export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  status?: LinkStatus;
  submittedOn: Date;
  submittedBy?: Types.ObjectId;
  companyName?: string;
  userNote?: string;
  datePosted: Date;
  jobDescription: string;
  location: JobPostingLocation;
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
    datePosted: {
      type: Date,
    },
    jobDescription: {
      type: String,
    },
    location: {
      type: String,
      enum: Object.values(JobPostingLocation),
      default: JobPostingLocation.US,
    },
  },
  { timestamps: true }
);

export const LinkModel = mongoose.model<ILink>('Link', LinkSchema);
