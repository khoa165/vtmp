import {
  JobPostingModel,
  IJobPosting,
  JobFilter,
} from '@/models/job-posting.model';
import { toMongoId } from '@/testutils/mongoID.testutil';
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

  getJobPostingsUserHasNotAppliedTo: async (
    userId: string
  ): Promise<IJobPosting[]> => {
    return JobPostingModel.aggregate([
      {
        // Perform a filtered join between JobPosting and Application collection
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
          deletedAt: null,
        },
      },
    ]);
  },

  getJobPostingsUserHasNotAppliedToWithFilter: async (
    userId: string,
    filter: JobFilter
  ): Promise<IJobPosting[]> => {
    // declare it's a string-keyed object
    const dynamicMatch: Record<string, unknown> = {};

    if (filter.jobTitle) dynamicMatch.jobTitle = filter.jobTitle;
    if (filter.companyName) dynamicMatch.companyName = filter.companyName;
    if (filter.location) dynamicMatch.location = filter.location;
    if (filter.datePosted)
      dynamicMatch.datePosted = { $gte: filter.datePosted };

    return JobPostingModel.aggregate([
      {
        // Perform a filtered join between JobPosting and Application collection
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
          ...dynamicMatch,
          userApplication: { $size: 0 },
          deletedAt: null,
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
