import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  Department,
  JobPostingLocation,
  OfferType,
} from '@vtmp/common/constants';

export interface IJobPosting extends Document {
  _id: Types.ObjectId;
  linkId: Types.ObjectId;
  externalPostingId?: string;
  url: string;
  jobTitle: string;
  companyName: string;
  location: JobPostingLocation;
  departmentStatus: Department;
  type: OfferType;
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
    departmentStatus: {
      type: String,
      enum: Object.values(Department),
      default: Department.SWE,
    },
    type: {
      type: String,
      enum: Object.values(OfferType),
      default: OfferType.INTERNSHIP,
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
