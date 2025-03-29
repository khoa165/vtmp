import JobPostingModel from '@/models/jobPosting.model';

const JobPostingRepository = {
  createJobPosting: async (jobPostingData: object) => {
    return JobPostingModel.create(jobPostingData);
  },
  getJobPostingById: async (jobId: string) => {
    return JobPostingModel.findById(jobId).lean();
  },
  updateJobPostingById: async (jobId: string, newUpdate: object) => {
    const updatedJobPosting = await JobPostingModel.findByIdAndUpdate(
      jobId,
      { $set: newUpdate },
      { new: true }
    );

    return updatedJobPosting;
  },
  deleteJobPostingById: async (jobId: string) => {
    const currentDate: Date = new Date();
    const dateDeleted: Date = new Date(currentDate.getDate() + 7);

    const deletedJobPosting = await JobPostingModel.findByIdAndUpdate(
      jobId,
      { $set: { deletedAt: dateDeleted } },
      { new: true }
    );

    return deletedJobPosting;
  },
};

export default JobPostingRepository;
