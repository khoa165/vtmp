import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  JobFunction,
  LinkStatus,
  JobType,
  LinkProcessingSubStatus,
} from '@vtmp/common/constants';
import { LinkRegion } from '@vtmp/common/constants';
export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  originalUrl?: string;
  status: LinkStatus;
  subStatus?: LinkProcessingSubStatus;
  submittedOn: Date;
  jobTitle?: string;
  companyName?: string;
  location?: LinkRegion;
  jobFunction?: JobFunction;
  jobType?: JobType;
  datePosted?: Date;
  jobDescription?: string;
  attemptsCount: number;
  lastProcessedAt?: Date;
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
    originalUrl: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(LinkStatus),
      default: LinkStatus.PENDING,
    },
    subStatus: {
      type: String,
      enum: Object.values(LinkProcessingSubStatus),
      required: function () {
        return this.status === LinkStatus.FAILED;
      },
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
    },
    jobFunction: {
      type: String,
      enum: Object.values(JobFunction),
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
    },
    datePosted: {
      type: Date,
    },
    jobDescription: {
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

// LinkSchema.post('findOneAndUpdate', function (doc) {
//   if (!doc) {
//     return;
//   }

//   if (doc.status === LinkStatus.FAILED && !doc.subStatus) {
//     throw new Error('FAIL status must include a subStatus');
//   }

//   if (doc.status !== LinkStatus.FAILED && doc.subStatus) {
//     throw new Error(`${doc.status} status must not include a subStatus`);
//   }
// });

export const LinkModel = mongoose.model<ILink>('Link', LinkSchema);
