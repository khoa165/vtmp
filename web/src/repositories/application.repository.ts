import mongoose, { ClientSession } from 'mongoose';

import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';

import { ApplicationModel } from '@/models/application.model';
import { IApplication } from '@/types/entities';

export const ApplicationRepository = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }): Promise<IApplication> => {
    return ApplicationModel.create({
      jobPostingId,
      userId,
    });
  },

  getApplicationIfExists: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }): Promise<IApplication | null> => {
    return ApplicationModel.findOne({
      jobPostingId,
      userId,
    });
  },

  getApplications: async ({
    userId,
    filters = {},
  }: {
    userId: string;
    filters?: { status?: ApplicationStatus };
  }): Promise<IApplication[]> => {
    return ApplicationModel.find({
      userId: userId,
      deletedAt: null,
      ...filters,
    });
  },

  getApplicationById: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }): Promise<IApplication | null> => {
    return ApplicationModel.findOne({
      _id: applicationId,
      userId: userId,
      deletedAt: null,
    });
  },

  updateApplicationById: async ({
    userId,
    applicationId,
    updatedMetadata,
    options,
    session,
  }: {
    userId: string;
    applicationId: string;
    updatedMetadata: {
      status?: ApplicationStatus;
      note?: string;
      referrer?: string;
      portalLink?: string;
      interest?: InterestLevel;
      deletedAt?: Date | null;
      hasOA?: boolean;
    };
    options?: {
      includeDeletedDoc?: boolean;
    };
    session?: ClientSession;
  }): Promise<IApplication | null> => {
    return ApplicationModel.findOneAndUpdate(
      {
        _id: applicationId,
        userId,
        ...(options?.includeDeletedDoc ? {} : { deletedAt: null }),
      },
      { $set: updatedMetadata },
      { new: true, session: session ?? null }
    );
  },

  deleteApplicationById: async ({
    userId,
    applicationId,
  }: {
    userId: string;
    applicationId: string;
  }): Promise<IApplication | null> => {
    return ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },

  getApplicationsCountByStatus: async (userId: string) => {
    const result = await ApplicationModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    // After this step, result looks like [{_id: SUBMITTED, count: 10}, {_id: OFFERED, count: 10}, ...]
    const countGroupByStatus = result.reduce((accummulator, item) => {
      accummulator[item._id] = item.count;
      return accummulator;
    }, {});

    return countGroupByStatus;
  },

  getApplicationsCountByUser: async () => {
    return ApplicationModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: '$userId',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $project: {
          userId: '$_id',
          _id: 0,
          count: 1,
          name: {
            $concat: ['$user.firstName', ' ', '$user.lastName'],
          },
        },
      },
      {
        $unset: 'userId',
      },
      {
        $sort: {
          count: 1,
        },
      },
    ]);
  },
};
