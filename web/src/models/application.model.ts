import mongoose, { Document } from 'mongoose';

enum ApplicationStatus {
  SUBMITTED = 'submitted',
  INTERVIEW = 'interview',
  OFFER_RECEIVED = 'offer_received',
  REJECTED = 'rejected',
}

interface IApplication extends Document {
  jobPostingId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  isApplied: boolean;
  status: ApplicationStatus;
  appliedOnDate: Date;
  note?: string;
}

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
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
    isApplied: {
      type: Boolean,
      default: true,
      // false: when user must have saved/favorited this posting but didn't apply yet (extended)
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
