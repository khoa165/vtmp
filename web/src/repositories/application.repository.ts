import { ApplicationModel, IApplication } from '@/models/application.model';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { ClientSession } from 'mongoose';

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

  getApplications: async (userId: string): Promise<IApplication[]> => {
    return ApplicationModel.find({
      userId: userId,
      deletedAt: null,
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
};
