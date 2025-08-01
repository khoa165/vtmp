import mongoose, { Schema } from 'mongoose';

import {
  ApplicationStatus,
  InterestLevel,
  JobPostingRegion,
} from '@vtmp/common/constants';

import { JobPostingModel } from '@/models/job-posting.model';
import { IApplication } from '@/types/entities';

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
    jobPostingId: {
      type: Schema.Types.ObjectId,
      ref: 'JobPosting',
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hasApplied: {
      type: Boolean,
      default: true,
    },
    hasOA: {
      type: Boolean,
      default: false,
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
    url: {
      type: String,
    },
    interest: {
      type: String,
      enum: Object.values(InterestLevel),
      default: InterestLevel.MEDIUM,
    },
  },
  { timestamps: true }
);

ApplicationSchema.pre('save', async function () {
  const jobPosting = await JobPostingModel.findById(this.jobPostingId);
  if (jobPosting) {
    this.companyName = jobPosting.companyName;
    this.jobTitle = jobPosting.jobTitle;
    this.location = jobPosting.location;
    this.url = jobPosting.url;
  }
});

ApplicationSchema.index({ userId: 1 });

export const ApplicationModel = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema
);
