import { JobPostingModel } from '@/models/job-posting.model';

export const JobPostingRepository = {
  createJobPosting: async (jobPostingData: object) => {
    return JobPostingModel.create(jobPostingData);
  },

  getJobPostingById: async (jobId: string) => {
    return JobPostingModel.findById(jobId).lean();
  },

  updateJobPostingById: async (jobId: string, newUpdate: object) => {
    return JobPostingModel.findByIdAndUpdate(
      jobId,
      { $set: newUpdate },
      { new: true }
    );
  },

  deleteJobPostingById: async (jobId: string) => {
    return JobPostingModel.findByIdAndUpdate(
      jobId,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
