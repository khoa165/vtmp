import ApplicationRepository from '@/repositories/application.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { DuplicateResourceError, ResourceNotFoundError } from '@/utils/errors';

const ApplicationService = {
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
        resource: 'JobPosting',
      });
    }

    const applicationExists = await ApplicationRepository.doesApplicationExist({
      jobPostingId,
      userId,
    });
    if (applicationExists) {
      throw new DuplicateResourceError('Application already exists', {
        resource: 'Application',
      });
    }

    return ApplicationRepository.createApplication({
      jobPostingId,
      userId,
    });
  },
};

export default ApplicationService;
