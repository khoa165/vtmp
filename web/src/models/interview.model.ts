import mongoose, { Document } from 'mongoose';

enum InterviewType {
  OA = 'online_assessment',
  BEHAVIORIAL = 'behaviorial',
  TECHNICAL = 'technical',
  RECRUITER_SCREEN = 'recruiter_screen',
  DEBUG = 'debug',
  SYSTEM_DESIGN = 'system_design',
  TRIVIA = 'trivia',
  PROJECT_WALKTHROUGH = 'project_walkthrough',
  PRACTICAL = 'practical',
  HIRING_MANAGER = 'hiring_manager',
}

enum InterviewStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  WITHDRAW = 'withdraw',
  UPCOMING = 'upcoming',
}

interface IInterview extends Document {
  applicationId: mongoose.Schema.Types.ObjectId;
  interviewType: InterviewType[];
  status: InterviewStatus;
  interviewOnDate: Date;
  note?: string;
}

const InterviewSchema = new mongoose.Schema<IInterview>({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  interviewType: {
    type: [String],
    enum: Object.values(InterviewType),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(InterviewStatus),
    default: InterviewStatus.UPCOMING,
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
