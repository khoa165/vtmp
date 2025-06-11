import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  JobFunction,
  LinkStatus,
  JobType,
  LinkProcessStage,
} from '@vtmp/common/constants';
import { LinkRegion } from '@vtmp/common/constants';
export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  status: LinkStatus;
  processStage: LinkProcessStage;
  submittedOn: Date;
  jobTitle?: string;
  companyName?: string;
  location: LinkRegion;
  jobFunction: JobFunction;
  jobType: JobType;
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
      enum: Object.values(LinkRegion),
      default: LinkRegion.OTHER,
    },
    processStage: {
      type: String,
      enum: Object.values(LinkProcessStage),
      default: LinkProcessStage.NOT_PROCESSED,
    },
    jobFunction: {
      type: String,
      enum: Object.values(JobFunction),
      default: JobFunction.SOFTWARE_ENGINEER,
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      default: JobType.INTERNSHIP,
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
