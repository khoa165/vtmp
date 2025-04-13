import { ApplicationRepository } from '@/repositories/application.repository';
import { InterviewRepository } from '@/repositories/interview.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import {
  ApplicationStatus,
  InterestLevel,
  InterviewStatus,
} from '@/types/enums';
import {
  DuplicateResourceError,
  ForbiddenError,
  ResourceNotFoundError,
} from '@/utils/errors';
import mongoose, { ClientSession } from 'mongoose';

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

  updateApplicationById: async (
    userId: string,
    applicationId: string,
    updatedMetadata: {
      note?: string;
      referrer?: string;
      portalLink?: string;
      interest?: InterestLevel;
      status?: Exclude<ApplicationStatus, ApplicationStatus.REJECTED>;
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

  markApplicationAsRejected: async ({
    userId,
    applicationId,
  }: {
    userId: string;
    applicationId: string;
  }) => {
    // Call getApplicationById to check existence.
    // If null, return ResourceNotFound
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

    // Start a transaction
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      // Call updateApplicationById with {status: REJECTED} => return updated application
      const updatedApplication =
        await ApplicationRepository.updateApplicationById({
          userId,
          applicationId,
          updatedMetadata: { status: ApplicationStatus.REJECTED },
          session,
        });
      // Call getInterviewsByApplicationId, pass in status => get list of interviews
      const pendingInterviews =
        await InterviewRepository.getInterviewsByApplicatonId({
          userId,
          applicationId,
          filters: { status: InterviewStatus.PENDING },
          session,
        });

      if (pendingInterviews.length > 0) {
        // Call updateInterviewsWithStatus (updateMany), this takes an array of InterviewIds returned above
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

      // Commit the transaction
      await session.commitTransaction();
      return updatedApplication;
    } catch (error) {
      // Roll back transaction in case of error
      await session.abortTransaction();
      throw error;
    } finally {
      // Make sure to end the transaction
      session.endSession();
    }
  },

  deleteApplication: async ({
    userId,
    applicationId,
  }: {
    userId: string;
    applicationId: string;
  }) => {
    // Check if applicationId exists
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

    // call getInterviewsByApplicationId to get an array to check if this app has interviews
    const interviews = await InterviewRepository.getInterviewsByApplicatonId({
      userId,
      applicationId,
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
