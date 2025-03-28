import JobPosting from '@/models/jobPosting.model';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const JobPostingRepository = {
  createJobPost: async (jobPostingData: object) => {
    const newJobPosting = new JobPosting(jobPostingData);
    await newJobPosting.save();
    
    return newJobPosting;
  },
  updateById: async (jobId: string, newUpdate: object) => {
    const updatedJobPosting = await JobPosting.findByIdAndUpdate(
      new ObjectId(jobId),
      { $set: newUpdate },
      { new: true, runValidators: true }
    );

    return updatedJobPosting;
  },
  deleteById: async (jobId: string) => {
    const currentDate: Date = new Date();
    const dateDeleted: Date = new Date(currentDate.getDate() + 7);

    const deletedJobPosting = await JobPosting.findByIdAndUpdate(
      new ObjectId(jobId),
      { $set: { deletedAt: dateDeleted } },
      { new: true, runValidators: true }
    );

    return deletedJobPosting;
  },
};

export default JobPostingRepository;
