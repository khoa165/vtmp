import { EnvConfig } from '@/config/env';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import { JobFunction, JobPostingRegion, JobType } from '@vtmp/common/constants';
import { JWTUtils } from '@vtmp/server-common/utils';
import z from 'zod';

export const JobPostingService = {
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
    pagination,
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
    pagination?: {
      limit?: number;
      cursor?: string | undefined;
    };
  }) => {
    const jobPostings =
      await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
        userId: userId,
        limit: pagination?.limit || 10,
        filters: filters ?? {},
        cursor: pagination?.cursor
          ? JWTUtils.peekAndParseToken(
              pagination.cursor,
              z.object({ _id: z.string() })
            )
          : undefined,
      });
    return {
      data: jobPostings,
      cursor:
        jobPostings.length === pagination?.limit
          ? JWTUtils.createTokenWithPayload(
              { _id: jobPostings[jobPostings.length - 1]?._id.toString() },
              EnvConfig.get().JWT_SECRET
            )
          : undefined,
    };
  },
};
