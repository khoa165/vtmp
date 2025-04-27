import { ApplicationRepository } from '@/repositories/application.repository';
import { InterviewRepository } from '@/repositories/interview.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import {
  ApplicationStatus,
  InterestLevel,
  InterviewStatus,
} from '@vtmp/common/constants';
import {
  DuplicateResourceError,
  ForbiddenError,
  InternalServerError,
  ResourceNotFoundError,
} from '@/utils/errors';
import mongoose, { ClientSession } from 'mongoose';
import { IApplication } from '@/models/application.model';

export const ApplicationService = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }): Promise<IApplication | null> => {
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

  getApplications: async (userId: string): Promise<IApplication[]> => {
    return ApplicationRepository.getApplications(userId);
  },

  getApplicationById: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }): Promise<IApplication | null> => {
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

  updateApplicationById: async ({
    userId,
    applicationId,
    updatedMetadata,
  }: {
    userId: string;
    applicationId: string;
    updatedMetadata: {
      note?: string;
      referrer?: string;
      portalLink?: string;
      interest?: InterestLevel;
      status?: Exclude<ApplicationStatus, ApplicationStatus.REJECTED>;
    };
  }): Promise<IApplication | null> => {
    if (updatedMetadata.status === ApplicationStatus.REJECTED) {
      throw new InternalServerError('Rejecting an application is not allowed', {
        applicationId,
        userId,
      });
    }

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

  markApplicationAsRejected: async ({
    userId,
    applicationId,
  }: {
    userId: string;
    applicationId: string;
  }): Promise<IApplication | null> => {
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

    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId,
          applicationId,
          updatedMetadata: { status: ApplicationStatus.REJECTED },
          session,
        });

      const pendingInterviews = await InterviewRepository.getInterviews({
        userId,
        filters: { applicationId, status: InterviewStatus.PENDING },
        session,
      });

      if (pendingInterviews.length > 0) {
        const interviewIds = pendingInterviews.map(
          (pendingInterview) => pendingInterview.id
        );
        await InterviewRepository.updateInterviewsWithStatus({
          userId,
          interviewIds,
          updatedStatus: InterviewStatus.FAILED,
          session,
        });
      }

      await session.commitTransaction();
      return updatedApplication;
    } catch (error: unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  deleteApplicationById: async ({
    userId,
    applicationId,
  }: {
    userId: string;
    applicationId: string;
  }): Promise<IApplication | null> => {
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

    // call getInterviews to get an array to check if this app has interviews
    const interviews = await InterviewRepository.getInterviews({
      userId,
      filters: { applicationId },
    });
    if (interviews.length > 0) {
      throw new ForbiddenError(
        'Cannot delete application that has interviews',
        { userId, applicationId }
      );
    }

    // If empty, allow soft delete of application
    const deletedApplication =
      await ApplicationRepository.deleteApplicationById({
        userId,
        applicationId,
      });
    return deletedApplication;
  },
};
