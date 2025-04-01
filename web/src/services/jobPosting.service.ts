import JobPostingRepository from '@/repositories/jobPosting.repository';
import { ResourceNotFoundError } from '../utils/errors';

const JobPostingService = {
  updateJobPostingById: async (jobId: string, newUpdate: object) => {
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
    const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
      jobId
    );
    if (!deletedJobPosting) {
      throw new ResourceNotFoundError('Job posting not found', {
        jobId,
      });
    }

    return deletedJobPosting;
  },
};

export default JobPostingService;
