import mongoose, { Document } from 'mongoose';
import { ApplicationStatus } from '@/types/enums';

interface IApplication extends Document {
  jobPostingId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  hasApplied: boolean;
  status: ApplicationStatus;
  appliedOnDate: Date;
  note?: string;
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
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);
