import { InterviewModel, IInterview } from '@/models/interview.model';
import { InterviewStatus, InterviewType } from '@common/enums';
import { ClientSession, UpdateResult } from 'mongoose';

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

  getInterviewsByApplicationId: async ({
    applicationId,
    userId,
    filters,
    session,
  }: {
    applicationId: string;
    userId: string;
    filters?: {
      status?: InterviewStatus;
    };
    session?: ClientSession;
  }): Promise<IInterview[]> => {
    return InterviewModel.find(
      {
        applicationId,
        userId,
        deletedAt: null,
        ...(filters || {}),
      },
      null,
      { session: session ?? null }
    );
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
    session,
  }: {
    userId: string;
    interviewIds: string[];
    updatedStatus: InterviewStatus;
    session?: ClientSession;
  }): Promise<UpdateResult> => {
    return InterviewModel.updateMany(
      {
        _id: { $in: interviewIds },
        userId,
        deletedAt: null,
      },
      { $set: { status: updatedStatus } },
      session ? { session } : {}
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
