import { JobPostingModel, IJobPosting } from '@/models/job-posting.model';
import mongoose from 'mongoose';

export const JobPostingRepository = {
  createJobPosting: async (jobPostingData: object): Promise<IJobPosting> => {
    return JobPostingModel.create(jobPostingData);
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

  getJobPostingsNotAppliedYet: async (userId: string) => {
    // What needs to be done here:
    // 1. $lookup then $match
    // 2. $lookup means we left outer join Job Posting with Application collection,
    // 3. For each document in Job Posting collection, Mongo runs a custom mini-query (pipeline)
    // Basically instead of joining with the whole big Application collection, we only left outer join
    // with a subset of it (that only contains applciation documents that satisfies certain filters)
    // 4. Then in $match stage, only take job postings that  have $size empty
    return JobPostingModel.aggregate([
      {
        // Perform a filtered joib between JobPosting and Application collection
        $lookup: {
          from: 'Application',
          let: { jobId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$jobPostingId', '$$jobId'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] },
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
      {
        $project: {
          userApplication: 0,
        },
      },
    ]);
  },
};
