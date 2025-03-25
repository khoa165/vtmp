import mongoose, { Document } from 'mongoose';

enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  OA_RECEIVED = 'OA_RECEIVED',
  WITHDRAWN = 'WITHDRAWN',
}

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
