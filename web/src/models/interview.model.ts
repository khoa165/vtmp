import mongoose, { Schema } from 'mongoose';

import {
  InterviewStatus,
  InterviewType,
  JobPostingRegion,
  InterviewShareStatus,
} from '@vtmp/common/constants';

import { ApplicationModel } from '@/models/application.model';
import { IInterview } from '@/types/entities';

const InterviewSchema = new mongoose.Schema<IInterview>(
  {
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
    shareStatus: {
      type: String,
      enum: Object.values(InterviewShareStatus),
      default: InterviewShareStatus.UNSHARED,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

InterviewSchema.pre('save', async function () {
  const application = await ApplicationModel.findOne({
    _id: this.applicationId,
    deletedAt: null,
  });
  if (application) {
    if (application.companyName) {
      this.companyName = application.companyName;
    }
    if (application.jobTitle) {
      this.jobTitle = application.jobTitle;
    }
    if (application.location) {
      this.location = application.location;
    }
  }
});

export const InterviewModel = mongoose.model<IInterview>(
  'Interview',
  InterviewSchema
);
