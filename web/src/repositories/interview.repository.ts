import escapeStringRegexp from 'escape-string-regexp';
import { ClientSession, PipelineStage, UpdateResult } from 'mongoose';

import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

import { InterviewModel, IInterview } from '@/models/interview.model';
import { toMongoId } from '@/testutils/mongoID.testutil';

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
    isShared = false,
    session,
  }: {
    filters: {
      userId?: string;
      applicationId?: string;
      companyName?: string;
      types?: InterviewType[];
      status?: InterviewStatus;
    };
    isShared?: boolean;
    session?: ClientSession;
  }): Promise<IInterview[]> => {
    const dynamicMatch: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filters?.userId) {
      dynamicMatch.userId = toMongoId(filters.userId);
    }

    if (filters?.applicationId) {
      dynamicMatch.applicationId = toMongoId(filters.applicationId);
    }

    if (filters?.companyName) {
      dynamicMatch.companyName = {
        $regex: escapeStringRegexp(filters.companyName),
        $options: 'i',
      };
    }

    if (filters?.types) {
      dynamicMatch.types = { $eq: filters.types };
    }

    if (filters?.status) {
      dynamicMatch.status = filters.status;
    }

    if (isShared) {
      dynamicMatch.sharedAt = { $ne: null };
    }

    const pipeline: PipelineStage[] = [
      { $match: dynamicMatch },
      {
        $addFields: {
          id: { $toString: '$_id' },
        },
      },
    ];

    if (isShared) {
      pipeline.push(
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: { path: '$user' },
        },
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
        }
      );
    }

    return await InterviewModel.aggregate(pipeline).session(session || null);
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
};
