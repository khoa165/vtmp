import { JobFunction, JobPostingRegion, JobType } from '@vtmp/common/constants';

import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ResourceNotFoundError } from '@/utils/errors';

export const JobPostingService = {
  getJobPostingById: async (jobId: string) => {
    const jobPosting = await JobPostingRepository.getJobPostingById(jobId);
    if (!jobPosting) {
      throw new ResourceNotFoundError('Job posting not found', {
        jobId,
      });
    }

    return jobPosting;
  },
  updateJobPostingById: async (
    jobId: string,
    newUpdate: {
      externalPostingId?: string;
      url?: string;
      jobTitle?: string;
      companyName?: string;
      location?: JobPostingRegion;
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

  getJobPostingsUserHasNotAppliedTo: async ({
    userId,
    filters,
  }: {
    userId: string;
    filters?: {
      jobTitle?: string;
      companyName?: string;
      location?: string;
      jobFunction?: JobFunction;
      jobType?: JobType;
      postingDateRangeStart?: Date;
      postingDateRangeEnd?: Date;
    };
  }) => {
    return JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
      userId: userId,
      filters: filters ?? {},
    });
  },
};
