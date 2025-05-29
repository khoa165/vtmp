import {
  JobPostingModel,
  IJobPosting,
  JobFilter,
} from '@/models/job-posting.model';
import { toMongoId } from '@/testutils/mongoID.testutil';
import escapeStringRegexp from 'escape-string-regexp';
import { ClientSession } from 'mongoose';

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
    newUpdate: object
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
    filter,
  }: {
    userId: string;
    filter?: JobFilter;
  }): Promise<IJobPosting[]> => {
    const dynamicMatch: Record<string, unknown> = {};

    if (filter?.jobTitle) {
      dynamicMatch.jobTitle = {
        $regex: escapeStringRegexp(filter.jobTitle),
        $options: 'i',
      };
    }
    if (filter?.companyName) {
      dynamicMatch.companyName = {
        $regex: escapeStringRegexp(filter.companyName),
        $options: 'i',
      };
    }
    if (filter?.location) dynamicMatch.location = filter.location;
    if (filter?.postingDateRangeStart || filter?.postingDateRangeEnd) {
      const datePostedFilter: Record<string, Date> = {};

      if (filter.postingDateRangeStart) {
        datePostedFilter.$gte = filter.postingDateRangeStart;
      }
      if (filter.postingDateRangeEnd) {
        datePostedFilter.$lte = filter.postingDateRangeEnd;
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
