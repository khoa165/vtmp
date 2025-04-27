import { JobPostingModel } from '@/models/job-posting.model';
import { ClientSession } from 'mongoose';

export const JobPostingRepository = {
  createJobPosting: async ({
    jobPostingData,
    session,
  }: {
    jobPostingData: object;
    session?: ClientSession;
  }) => {
    const jobPostings = await JobPostingModel.create([jobPostingData], {
      session: session ?? null,
    });

    return jobPostings[0];
  },

  getJobPostingById: async (jobId: string) => {
    return JobPostingModel.findById(jobId).lean();
  },

  updateJobPostingById: async (jobId: string, newUpdate: object) => {
    return JobPostingModel.findByIdAndUpdate(
      jobId,
      { $set: newUpdate },
      { new: true }
    ).lean();
  },

  deleteJobPostingById: async (jobId: string) => {
    return JobPostingModel.findByIdAndUpdate(
      jobId,
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean();
  },
};
