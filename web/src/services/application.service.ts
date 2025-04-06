import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';

export const ApplicationService = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    const jobPosting = await JobPostingRepository.getJobPostingById(
      jobPostingId
    );
    if (!jobPosting) {
      throw new ResourceNotFoundError('Job posting not found', {
        jobPostingId,
        userId,
      });
    }

    const applicationExists = await ApplicationRepository.doesApplicationExist({
      jobPostingId,
      userId,
    });
    if (applicationExists) {
      throw new DuplicateResourceError('Application already exists', {
        jobPostingId,
        userId,
      });
    }

    return ApplicationRepository.createApplication({
      jobPostingId,
      userId,
    });
  },
};
