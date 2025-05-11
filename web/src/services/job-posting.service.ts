import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import { JobPostingLocation } from '@vtmp/common/constants';
import { ClientSession, Types } from 'mongoose';
export const JobPostingService = {
  createJobPosting: async ({
    jobPostingData,
    session,
  }: {
    jobPostingData: {
      linkId: Types.ObjectId;
      externalPostingId?: string;
      url: string;
      jobTitle: string;
      companyName: string;
      location?: JobPostingLocation;
      datePosted?: Date;
      jobDescription?: string;
      adminNote?: string;
      submittedBy?: Types.ObjectId;
      deletedAt?: Date;
    };
    session?: ClientSession;
  }) => {
    return JobPostingRepository.createJobPosting({
      jobPostingData,
      session,
    });
  },

  updateJobPostingById: async (
    jobId: string,
    newUpdate: {
      externalPostingId?: string;
      url?: string;
      jobTitle?: string;
      companyName?: string;
      location?: JobPostingLocation;
      datePosted?: Date;
      jobDescription?: string;
      adminNote?: string;
    }
  ) => {
    const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
      jobId,
      newUpdate
    );
    if (!updatedJobPosting) {
      throw new ResourceNotFoundError('Job posting not found', {
        jobId,
      });
    }

    return updatedJobPosting;
  },

  deleteJobPostingById: async (jobId: string) => {
    const deletedJobPosting =
      await JobPostingRepository.deleteJobPostingById(jobId);
    if (!deletedJobPosting) {
      throw new ResourceNotFoundError('Job posting not found', {
        jobId,
      });
    }

    return deletedJobPosting;
  },

  getJobPostingsUserHasNotAppliedTo: async (userId: string) => {
    return JobPostingRepository.getJobPostingsUserHasNotAppliedTo(userId);
  },
};
