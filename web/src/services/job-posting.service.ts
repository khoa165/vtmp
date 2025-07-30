import z from 'zod';
import { EnvConfig } from '@/config/env';
import { JobPostingFilter } from '@/models/job-posting.model';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ResourceNotFoundError } from '@/utils/errors';
import { JobPostingRegion } from '@vtmp/common/constants';
import { JWTUtils } from '@vtmp/server-common/utils';

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
    filters?: JobPostingFilter;
  }) => {
    if (filters?.cursor) {
      const parsedCursor = filters?.cursor
        ? JWTUtils.peekAndParseToken(
            filters?.cursor,
            z.object({ cursor: z.string() })
          ).cursor
        : undefined;

      filters = {
        ...filters,
        ...(parsedCursor !== undefined ? { cursor: parsedCursor } : {}),
      };
    }

    const jobPostings =
      await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
        userId,
        filters: filters || {},
      });

    return {
      data: jobPostings.data,
      cursor:
        jobPostings.data.length === filters?.limit
          ? JWTUtils.createTokenWithPayload(
              { cursor: jobPostings.cursor },
              EnvConfig.get().JWT_SECRET
            )
          : undefined,
    };
  },

  getJobPostingsUserHasNotAppliedToCount: async ({
    userId,
    filters = {},
  }: {
    userId: string;
    filters?: JobPostingFilter;
  }) => {
    return JobPostingRepository.getJobPostingsUserNotAppliedToCount({
      userId,
      filters,
    });
  },
};
