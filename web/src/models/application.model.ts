import mongoose, { Document } from 'mongoose';
import { ApplicationStatus, InterestLevel } from '@/types/enums';

export interface IApplication extends Document {
  jobPostingId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
