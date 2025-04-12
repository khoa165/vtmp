import { InterviewModel, IInterview } from '@/models/interview.model';
import { InterviewStatus, InterviewType } from '@/types/enums';
import { UpdateResult } from 'mongoose';

export const InterviewRepository = {
  createInterview: async ({
    applicationId,
    userId,
    type,
    status,
    interviewOnDate,
    note,
  }: {
    applicationId: string;
    userId: string;
    type: InterviewType[];
    status?: InterviewStatus;
    interviewOnDate: Date;
    note?: string;
  }): Promise<IInterview> => {
    return InterviewModel.create({
      applicationId,
      userId,
      type,
      status,
      interviewOnDate,
      note,
    });
  },

  getInterviewById: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    return InterviewModel.findOne({
      _id: interviewId,
      userId: userId,
      deletedAt: null,
    });
  },

  getInterviews: async (userId: string): Promise<IInterview[]> => {
    return InterviewModel.find({ userId: userId, deletedAt: null });
  },

  getInterviewsByApplicatonId: async ({
    applicationId,
    userId,
    filters,
  }: {
    applicationId: string;
    userId: string;
    filters?: {
      status?: InterviewStatus;
    };
  }): Promise<IInterview[]> => {
    return InterviewModel.find({
      applicationId,
      userId,
      deletedAt: null,
      ...(filters || {}),
    });
  },

  updateInterviewById: async ({
    interviewId,
    userId,
    updatedMetaData,
  }: {
    interviewId: string;
    userId: string;
    updatedMetaData: {
      type?: InterviewType[];
      status?: InterviewStatus;
      interviewOnDate?: Date;
      note?: string;
    };
  }): Promise<IInterview | null> => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId: userId, deletedAt: null },
      { $set: updatedMetaData },
      { new: true }
    );
  },

  updateInterviewsWithStatus: async ({
    userId,
    interviewIds,
    updatedStatus,
  }: {
    userId: string;
    interviewIds: string[];
    updatedStatus: InterviewStatus;
  }): Promise<UpdateResult> => {
    return InterviewModel.updateMany(
      {
        _id: { $in: interviewIds },
        userId,
        deletedAt: null,
      },
      { $set: { status: updatedStatus } }
    );
  },

  deleteInterviewById: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId: userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
