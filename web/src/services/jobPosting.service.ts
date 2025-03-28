import JobPostingRepository from '@/repositories/jobPosting.repository';
import { ResourceNotFoundError } from '../utils/errors';

const JobPostingService = {
  updateById: async (id: string, newUpdate: object) => {
    try {
      const updatedJobPosting = await JobPostingRepository.updateById(
        id,
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
  deleteById: async (id: string) => {
    try {
      const deletedJobPosting = await JobPostingRepository.deleteById(id);
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
