import mongoose, { Document, Schema, Types } from 'mongoose';

import { LinkStatus, JobPostingRegion } from '@vtmp/common/constants';

export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  status: LinkStatus;
  submittedOn: Date;
  jobTitle?: string;
  companyName?: string;
  location: JobPostingRegion;
  datePosted?: Date;
  jobDescription?: string;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
}

const LinkSchema = new mongoose.Schema<ILink>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
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
    jobTitle: {
      type: String,
    },
    companyName: {
      type: String,
    },
    location: {
      type: String,
      enum: Object.values(JobPostingRegion),
      default: JobPostingRegion.US,
    },
    datePosted: {
      type: Date,
    },
    jobDescription: {
      type: String,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const LinkModel = mongoose.model<ILink>('Link', LinkSchema);
