import mongoose, { Document } from 'mongoose';

enum InterviewType {
  ONLINE_ASSESSMENT = 'ONLINE_ASSESSMENT',
  CRITICAL_THINKING = 'CRITICAL_THINKING',
  CODE_REVIEW = 'CODE_REVIEW',
  BEHAVIORIAL = 'BEHAVIORIAL',
  TECHNICAL = 'TECHNICAL',
  RECRUITER_SCREEN = 'RECRUITER_SCREEN',
  DEBUG = 'DEBUG',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  TRIVIA = 'TRIVIA',
  PROJECT_WALKTHROUGH = 'PROJECT_WALKTHROUGH',
  PRACTICAL = 'PRACTICAL',
  HIRING_MANAGER = 'HIRING_MANAGER',
}

enum InterviewStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  WITHDRAW = 'WITHDRAW',
  UPCOMING = 'UPCOMING',
  PENDING = 'PENDING',
}

interface IInterview extends Document {
  applicationId: mongoose.Schema.Types.ObjectId;
  type: InterviewStatus[];
  status: string;
  interviewOnDate: Date;
  note?: string;
}

const InterviewSchema = new mongoose.Schema<IInterview>({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  type: {
    type: [String],
    enum: Object.values(InterviewType),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(InterviewStatus),
    default: InterviewStatus.PENDING,
  },
  interviewOnDate: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
  },
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
