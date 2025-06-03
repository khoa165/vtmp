import mongoose, { Document, Schema, Types } from 'mongoose';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { JobPostingModel } from '@/models/job-posting.model';

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobPostingId: Types.ObjectId;
  companyName?: string;
  userId: Types.ObjectId;
  hasApplied: boolean;
  status: ApplicationStatus;
  appliedOnDate: Date;
  note?: string;
  deletedAt?: Date;
  referrer?: string;
  portalLink?: string;
  interest: InterestLevel;
}

const ApplicationSchema = new mongoose.Schema<IApplication>({
  jobPostingId: {
    type: Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  companyName: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hasApplied: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.SUBMITTED,
  },
  appliedOnDate: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  referrer: {
    type: String,
  },
  portalLink: {
    type: String,
  },
  interest: {
    type: String,
    enum: Object.values(InterestLevel),
    default: InterestLevel.MEDIUM,
  },
});

ApplicationSchema.pre('save', async function () {
  const jobPosting = await JobPostingModel.findById(this.jobPostingId);
  if (jobPosting) {
    this.companyName = jobPosting.companyName;
  }
});

export const ApplicationModel = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema
);

ApplicationSchema.index({
  companyName: 1,
  status: 1,
  appliedOnDate: -1,
  _id: 1,
});
