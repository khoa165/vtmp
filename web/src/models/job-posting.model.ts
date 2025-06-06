import mongoose, { Document, Schema, Types } from 'mongoose';
import { JobPostingRegion, JobFunction, JobType } from '@vtmp/common/constants';

export interface IJobPosting extends Document {
  _id: Types.ObjectId;
  linkId: Types.ObjectId;
  externalPostingId?: string;
  url: string;
  jobTitle: string;
  companyName: string;
  location: JobPostingRegion;
  datePosted?: Date;
  jobDescription?: string;
  adminNote?: string;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
  jobFunction: JobFunction;
  jobType: JobType;
}

export interface JobFilter {
  jobTitle?: string;
  companyName?: string;
  location?: string;
  jobFunction?: JobFunction;
  jobType?: JobType;
  postingDateRangeStart?: Date;
  postingDateRangeEnd?: Date;
}

const JobPostingSchema = new mongoose.Schema<IJobPosting>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
    },
    externalPostingId: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
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
    adminNote: {
      type: String,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
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
  },
  { timestamps: true }
);

export const JobPostingModel = mongoose.model<IJobPosting>(
  'JobPosting',
  JobPostingSchema
);
