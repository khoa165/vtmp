import mongoose, { Document, Schema, Types } from 'mongoose';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { ApplicationModel } from '@/models/application.model';

export interface IInterview extends Document {
  _id: Types.ObjectId;
  applicationId: Types.ObjectId;
  userId: Types.ObjectId;
  type: InterviewType[];
  status: InterviewStatus;
  interviewOnDate: Date;
  companyName?: string;
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
  companyName: {
    type: String,
  },
  note: {
    type: String,
  },
  deletedAt: {
    type: Date,
  },
});

InterviewSchema.pre('save', async function () {
  const application = await ApplicationModel.findOne({
    _id: this.applicationId,
    deletedAt: null,
  });
  if (application && application.companyName !== undefined) {
    this.companyName = application.companyName;
  }
});

export const InterviewModel = mongoose.model<IInterview>(
  'Interview',
  InterviewSchema
);
