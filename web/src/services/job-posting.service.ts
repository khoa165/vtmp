import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import { JobFunction, JobType } from '@vtmp/common/constants';

export const JobPostingService = {
  updateJobPostingById: async (jobId: string, newUpdate: object) => {
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
    filter,
  }: {
    userId: string;
    filter?: {
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
      filter: filter ?? {},
    });
  },
};
