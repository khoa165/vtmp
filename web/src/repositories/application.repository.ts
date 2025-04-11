import { ApplicationModel, IApplication } from '@/models/application.model';
import { ApplicationStatus, InterestLevel } from '@/types/enums';

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

  doesApplicationExist: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }): Promise<boolean> => {
    return !!(await ApplicationModel.exists({
      jobPostingId,
      userId,
    }));
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

  updateApplicationStatus: async (
    userId: string,
    applicationId: string,
    updatedStatus: ApplicationStatus
  ): Promise<IApplication | null> => {
    return ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId, deletedAt: null },
      { $set: { status: updatedStatus } },
      { new: true }
    );
  },

  updateApplicationMetadata: async (
    userId: string,
    applicationId: string,
    updatedMetadata: {
      note?: string;
      referrer?: string;
      portalLink?: string;
      interest?: InterestLevel;
    }
  ): Promise<IApplication | null> => {
    return ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId, deletedAt: null },
      { $set: updatedMetadata },
      { new: true }
    );
  },

  deleteApplicationById: async (
    userId: string,
    applicationId: string
  ): Promise<IApplication | null> => {
    return ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
