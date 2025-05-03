import mongoose, { Document, Schema, Types } from 'mongoose';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobPostingId: Types.ObjectId;
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

export const ApplicationModel = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema
);
