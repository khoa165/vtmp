import { JobPostingModel, IJobPosting } from '@/models/job-posting.model';
import { toMongoId } from '@/testutils/mongoID.testutil';

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
                    { $not: ['$deletedAt'] },
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
