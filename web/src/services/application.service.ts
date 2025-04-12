import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationStatus, InterestLevel } from '@/types/enums';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';

export const ApplicationService = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    const jobPosting =
      await JobPostingRepository.getJobPostingById(jobPostingId);
    if (!jobPosting) {
      throw new ResourceNotFoundError('Job posting not found', {
        jobPostingId,
        userId,
      });
    }

    const application = await ApplicationRepository.getApplicationIfExists({
      jobPostingId,
      userId,
    });

    if (application) {
      if (application.deletedAt) {
        return ApplicationRepository.updateApplicationById({
          userId,
          applicationId: application.id,
          updatedMetadata: { deletedAt: null },
          options: { includeDeletedDoc: true },
        });
      } else {
        throw new DuplicateResourceError('Application already exists', {
          jobPostingId,
          userId,
        });
      }
    }

    return ApplicationRepository.createApplication({
      jobPostingId,
      userId,
    });
  },

  getApplications: async (userId: string) => {
    return ApplicationRepository.getApplications(userId);
  },

  getApplicationById: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    const application = await ApplicationRepository.getApplicationById({
      applicationId,
      userId,
    });

    if (!application) {
      throw new ResourceNotFoundError('Application not found', {
        applicationId,
        userId,
      });
    }

    return application;
  },

  updateApplicationStatus: async (
    userId: string,
    applicationId: string,
    updatedStatus: ApplicationStatus
  ) => {
    const updatedApplication =
      await ApplicationRepository.updateApplicationById({
        userId,
        applicationId,
        updatedMetadata: { status: updatedStatus },
      });

    if (!updatedApplication) {
      throw new ResourceNotFoundError('Application not found', {
        applicationId,
        userId,
      });
    }

    return updatedApplication;
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
  ) => {
    const updatedApplication =
      await ApplicationRepository.updateApplicationById({
        userId,
        applicationId,
        updatedMetadata,
      });

    if (!updatedApplication) {
      throw new ResourceNotFoundError('Application not found', {
        applicationId,
        userId,
      });
    }

    return updatedApplication;
  },
};
