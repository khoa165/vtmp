import mongoose, { Document, Schema, Types } from 'mongoose';

import {
  JobFunction,
  LinkStatus,
  JobType,
  LinkProcessingFailureStage,
  LinkRegion,
} from '@vtmp/common/constants';

export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  originalUrl: string;
  status: LinkStatus;
  failureStage?: LinkProcessingFailureStage;
  submittedOn: Date;
  jobTitle?: string;
  companyName?: string;
  location?: LinkRegion;
  jobFunction?: JobFunction;
  jobType?: JobType;
  datePosted?: Date;
  jobDescription?: string;
  aiNote?: string;
  attemptsCount: number;
  lastProcessedAt?: Date;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
}

const LinkSchema = new mongoose.Schema<ILink>(
  {
    originalUrl: {
      type: String,
      unique: true,
      required: true,
    },
    url: {
      type: String,
      default: function (this: ILink) {
        return this.originalUrl;
      },
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(LinkStatus),
      default: LinkStatus.PENDING_PROCESSING,
    },
    failureStage: {
      type: String,
      enum: Object.values(LinkProcessingFailureStage),
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
      enum: Object.values(LinkRegion),
      default: LinkRegion.UNKNOWN,
    },
    jobFunction: {
      type: String,
      enum: Object.values(JobFunction),
      default: JobFunction.UNKNOWN,
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      default: JobType.UNKNOWN,
    },
    datePosted: {
      type: Date,
    },
    jobDescription: {
      type: String,
    },
    aiNote: {
      type: String,
    },
    attemptsCount: {
      type: Number,
      default: 0,
    },
    lastProcessedAt: {
      type: Date,
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
