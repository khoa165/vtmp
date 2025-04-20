import mongoose, { Document } from 'mongoose';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

interface IInterview extends Document {
  applicationId: mongoose.Schema.Types.ObjectId;
  type: InterviewType[];
  status: InterviewStatus;
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

export const InterviewModel = mongoose.model<IInterview>(
  'Interview',
  InterviewSchema
);
