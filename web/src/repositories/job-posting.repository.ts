import escapeStringRegexp from 'escape-string-regexp';
import { ClientSession } from 'mongoose';

import { JobPostingRegion } from '@vtmp/common/constants';

import { JobPostingModel } from '@/models/job-posting.model';
import { toMongoId } from '@/testutils/mongoID.testutil';
import { IJobPosting, JobFilter } from '@/types/entities';

export const JobPostingRepository = {
  createJobPosting: async ({
    jobPostingData,
    session,
  }: {
    jobPostingData: object;
    session?: ClientSession;
  }): Promise<IJobPosting | undefined> => {
    const jobPostings = await JobPostingModel.create([jobPostingData], {
      session: session ?? null,
    });

    return jobPostings[0];
  },

  getJobPostingById: async (jobId: string): Promise<IJobPosting | null> => {
    return JobPostingModel.findOne({ _id: jobId, deletedAt: null }).lean();
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
  ): Promise<IJobPosting | null> => {
    return JobPostingModel.findOneAndUpdate(
      { _id: jobId, deletedAt: null },
      { $set: newUpdate },
      { new: true }
    ).lean();
  },

  deleteJobPostingById: async (jobId: string): Promise<IJobPosting | null> => {
    return JobPostingModel.findOneAndUpdate(
      { _id: jobId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean();
  },

  getJobPostingsUserHasNotAppliedTo: async ({
    userId,
    filters,
  }: {
    userId: string;
    filters?: JobFilter;
  }): Promise<IJobPosting[]> => {
    const dynamicMatch: Record<string, unknown> = {};

    if (filters?.jobTitle) {
      dynamicMatch.jobTitle = {
        $regex: escapeStringRegexp(filters.jobTitle),
        $options: 'i',
      };
    }
    if (filters?.companyName) {
      dynamicMatch.companyName = {
        $regex: escapeStringRegexp(filters.companyName),
        $options: 'i',
      };
    }
    if (filters?.jobFunction) dynamicMatch.jobFunction = filters.jobFunction;
    if (filters?.location) dynamicMatch.location = filters.location;
    if (filters?.postingDateRangeStart || filters?.postingDateRangeEnd) {
      const datePostedFilter: Record<string, Date> = {};

      if (filters.postingDateRangeStart) {
        datePostedFilter.$gte = filters.postingDateRangeStart;
      }
      if (filters.postingDateRangeEnd) {
        datePostedFilter.$lte = filters.postingDateRangeEnd;
      }

      dynamicMatch.datePosted = datePostedFilter;
    }

    return JobPostingModel.aggregate([
      {
        $match: {
          ...dynamicMatch,
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'applications',
          let: { jobId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$jobPostingId', '$$jobId'] },
                    { $eq: ['$userId', toMongoId(userId)] },
                    { $eq: ['$deletedAt', null] },
                  ],
                },
              },
            },
          ],
          as: 'userApplication',
        },
      },
      {
        $match: {
          userApplication: { $size: 0 },
        },
      },
      {
        $project: {
          userApplication: 0,
        },
      },
    ]);
  },
};
