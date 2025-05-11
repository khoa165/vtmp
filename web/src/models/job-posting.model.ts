import mongoose, { Document, Schema, Types } from 'mongoose';
import { JobPostingLocation } from '@vtmp/common/constants';

export interface IJobPosting extends Document {
  _id: Types.ObjectId;
  linkId: Types.ObjectId;
  externalPostingId?: string;
  url: string;
  jobTitle: string;
  companyName: string;
  location: JobPostingLocation;
  datePosted?: Date;
  jobDescription?: string;
  adminNote?: string;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
}

const JobPostingSchema = new mongoose.Schema<IJobPosting>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      unique: true,
      sparse: true,
    },
    externalPostingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
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
      type: Schema.Types.ObjectId,
      ref: 'User',
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
