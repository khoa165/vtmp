import escapeStringRegexp from 'escape-string-regexp';
import { ClientSession, PipelineStage, UpdateResult } from 'mongoose';

import {
  InterviewInsight,
  InterviewShareStatus,
  InterviewStatus,
  InterviewType,
} from '@vtmp/common/constants';

import { InterviewModel, IInterview } from '@/models/interview.model';
import { toMongoId } from '@/testutils/mongoID.testutil';
import redisClient from '@/config/cache';

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
    status?: InterviewStatus | undefined;
    interviewOnDate: Date;
    note?: string | undefined;
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

  createInterviewInsight: async ({
    interviewInsight,
  }: {
    interviewInsight: InterviewInsight;
  }): Promise<InterviewInsight> => {
    await redisClient.json.set(
      `interview_insight:${interviewInsight.companyName}`,
      '$',
      interviewInsight
    );

    return interviewInsight;
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
    filters?: {
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
      dynamicMatch.types = { $in: filters.types };
    }

    if (filters?.status) {
      dynamicMatch.status = filters.status;
    }

    if (isShared) {
      dynamicMatch.shareStatus = { $ne: InterviewShareStatus.UNSHARED };
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
                if: {
                  $eq: ['$shareStatus', InterviewShareStatus.SHARED_PUBLIC],
                },
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

    if (session) {
      return await InterviewModel.aggregate(pipeline).session(session);
    }
    return await InterviewModel.aggregate(pipeline);
  },

  getInterviewInsight: async ({
    filters = {},
  }: {
    filters: {
      companyName?: string;
    };
  }): Promise<InterviewInsight | null> => {
    if (!filters.companyName) return null;

    const result = await redisClient.ft.search(
      'idx:companies',
      `@companyName:"${filters.companyName}"`
    );

    // Ensure result has documents property before mapping
    const insights =
      typeof result === 'object' &&
      result !== null &&
      'documents' in result &&
      Array.isArray(result.documents)
        ? (result.documents
            .map((doc) =>
              doc && typeof doc === 'object' && 'value' in doc
                ? (doc as { value: InterviewInsight }).value
                : null
            )
            .filter(Boolean) as InterviewInsight[])
        : [];

    return insights[0] ?? null;
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
      shareStatus?: InterviewShareStatus;
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
