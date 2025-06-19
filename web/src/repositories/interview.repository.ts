import { InterviewModel, IInterview } from '@/models/interview.model';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { ClientSession, UpdateResult } from 'mongoose';

export const InterviewRepository = {
  createInterview: async ({
    applicationId,
    userId,
    types,
    status,
    interviewOnDate,
    note,
  }: {
    applicationId: string;
    userId: string;
    types: InterviewType[];
    status?: InterviewStatus;
    interviewOnDate: Date;
    note?: string;
  }): Promise<IInterview> => {
    return InterviewModel.create({
      applicationId,
      userId,
      types,
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

  getInterviews: async ({
    filters = {},
    session,
  }: {
    filters: {
      userId?: string;
      applicationId?: string;
      status?: InterviewStatus;
      companyName?: string;
    };
    session?: ClientSession;
  }): Promise<IInterview[]> => {
    return InterviewModel.find(
      {
        deletedAt: null,
        ...filters,
      },
      null,
      session ? { session } : {}
    );
  },

  getSharedInterviews: async ({
    filters = {},
  }: {
    filters: {
      companyName?: string;
      types?: InterviewType[];
      status?: InterviewStatus;
    };
    session?: ClientSession;
  }): Promise<IInterview[]> => {
    return InterviewModel.aggregate([
      { $match: { deletedAt: null, isDisclosed: true, ...filters } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user: {
            $cond: {
              if: '$isDisclosed',
              then: {
                firstName: '$user.firstName',
                lastName: '$user.lastName',
              },
              else: undefined,
            },
          },
        },
      },
    ]);
  },

  updateInterviewById: async ({
    interviewId,
    userId,
    updatedMetadata,
  }: {
    interviewId: string;
    userId: string;
    updatedMetadata: {
      types?: InterviewType[];
      status?: InterviewStatus;
      interviewOnDate?: Date;
      note?: string;
    };
  }): Promise<IInterview | null> => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId, deletedAt: null },
      { $set: updatedMetadata },
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
      { _id: interviewId, userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },

  shareInterview: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId, deletedAt: null },
      {
        $set: {
          isDisclosed: true,
          sharedAt: new Date(),
        },
      },
      { new: true }
    );
  },
};
