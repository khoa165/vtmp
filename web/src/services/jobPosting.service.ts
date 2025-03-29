import JobPostingRepository from '@/repositories/jobPosting.repository';
import { ResourceNotFoundError } from '../utils/errors';

const JobPostingService = {
  updateJobPostingById: async (jobId: string, newUpdate: object) => {
    try {
      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        jobId,
        newUpdate
      );
      if (!updatedJobPosting) {
        throw new ResourceNotFoundError('Job posting not found', {
          status: 404,
        });
      }

      return updatedJobPosting;
    } catch (error) {
      throw error;
    }
  },
  deleteJobPostingById: async (jobId: string) => {
    try {
      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        jobId
      );
      if (!deletedJobPosting) {
        throw new ResourceNotFoundError('Job posting not found', {
          status: 404,
        });
      }

      return deletedJobPosting;
    } catch (error) {
      throw error;
    }
  },
};

export default JobPostingService;
