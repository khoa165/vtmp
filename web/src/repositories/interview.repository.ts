import escapeStringRegexp from 'escape-string-regexp';
import { ClientSession, UpdateResult } from 'mongoose';

import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

import { InterviewModel, IInterview } from '@/models/interview.model';

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
  }): Promise<IInterview[]> => {
    const dynamicMatch: Record<string, unknown> = {};

    if (filters?.companyName) {
      dynamicMatch.companyName = {
        $regex: escapeStringRegexp(filters.companyName),
        $options: 'i',
      };
    }
    if (filters?.types) {
      dynamicMatch.types = { $in: filters.types };
    }
    if (filters?.status) {
      dynamicMatch.status = filters.status;
    }

    return await InterviewModel.aggregate([
      {
        $match: {
          deletedAt: null,
          sharedAt: { $ne: null },
          ...dynamicMatch,
        },
      },
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
              if: { $not: ['$isDisclosed'] },
              then: {
                firstName: '$user.firstName',
                lastName: '$user.lastName',
              },
              else: {
                firstName: 'Anonymous',
                lastName: 'User',
              },
            },
          },
        },
      },
    ]);
  },

  updateInterviewById: async ({
    interviewId,
    userId,
    newUpdate,
  }: {
    interviewId: string;
    userId: string;
    newUpdate: {
      types?: InterviewType[];
      status?: InterviewStatus;
      interviewOnDate?: Date;
      note?: string;
      isDisclosed?: boolean;
      sharedAt?: Date | null;
    };
  }): Promise<IInterview | null> => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId, deletedAt: null },
      { $set: newUpdate },
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

  updateInterviewSharing: async ({
    interviewId,
    userId,
    shareOptions,
  }: {
    interviewId: string;
    userId: string;
    shareOptions: {
      isDisclosed?: boolean;
      sharedAt?: Date | null;
    };
  }): Promise<IInterview | null> => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId, deletedAt: null },
      {
        $set: {
          ...shareOptions,
        },
      },
      { new: true }
    );
  },
};
