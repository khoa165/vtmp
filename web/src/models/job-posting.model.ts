import mongoose, { Document } from 'mongoose';
import { JobPostingLocation } from '@vtmp/common/constants';

interface IJobPosting extends Document {
  linkId: mongoose.Schema.Types.ObjectId;
  externalPostingId?: string;
  url: string;
  jobTitle: string;
  companyName: string;
  location?: JobPostingLocation;
  datePosted?: Date;
  jobDescription?: string;
  adminNote?: string;
  submittedBy: mongoose.Schema.Types.ObjectId;
  deletedAt?: Date;
}

const JobPostingSchema = new mongoose.Schema<IJobPosting>(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
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
      enum: Object.values(JobPostingLocation),
      default: JobPostingLocation.US,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const JobPostingModel = mongoose.model<IJobPosting>(
  'JobPosting',
  JobPostingSchema
);
