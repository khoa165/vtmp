import mongoose, { Document, Schema, Types } from 'mongoose';

import {
  InterviewStatus,
  InterviewType,
  JobPostingRegion,
} from '@vtmp/common/constants';

import { ApplicationModel } from '@/models/application.model';

export interface IInterview extends Document {
  _id: Types.ObjectId;
  applicationId: Types.ObjectId;
  userId: Types.ObjectId;
  types: InterviewType[];
  status: InterviewStatus;
  interviewOnDate: Date;
  companyName?: string;
  jobTitle?: string;
  location?: JobPostingRegion;
  note?: string;
  isDisclosed?: boolean;
  sharedAt?: Date;
  deletedAt?: Date;
}

const InterviewSchema = new mongoose.Schema<IInterview>({
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  types: {
    type: [String],
    enum: Object.values(InterviewType),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(InterviewStatus),
    default: InterviewStatus.PENDING,
  },
  interviewOnDate: {
    type: Date,
    required: true,
  },
  companyName: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  location: {
    type: String,
    enum: Object.values(JobPostingRegion),
    default: JobPostingRegion.US,
  },
  note: {
    type: String,
  },
  isDisclosed: {
    type: Boolean,
    default: true,
  },
  sharedAt: {
    type: Date,
    default: null,
  },
  deletedAt: {
    type: Date,
  },
});

InterviewSchema.pre('save', async function () {
  const application = await ApplicationModel.findOne({
    _id: this.applicationId,
    deletedAt: null,
  });
  if (application && application.companyName !== undefined) {
    this.companyName = application.companyName;
    this.jobTitle = application.jobTitle;
    this.location = application.location;
  }
});

export const InterviewModel = mongoose.model<IInterview>(
  'Interview',
  InterviewSchema
);
