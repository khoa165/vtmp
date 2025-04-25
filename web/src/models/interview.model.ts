import mongoose, { Document, Schema, Types } from 'mongoose';
import { InterviewStatus, InterviewType } from '@common/enums';

export interface IInterview extends Document {
  applicationId: Types.ObjectId;
  userId: Types.ObjectId;
  type: InterviewType[];
  status: InterviewStatus;
  interviewOnDate: Date;
  note?: string;
  deletedAt?: Date;
}

const InterviewSchema = new mongoose.Schema<IInterview>({
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  deletedAt: {
    type: Date,
  },
});

export const InterviewModel = mongoose.model<IInterview>(
  'Interview',
  InterviewSchema
);
