import ApplicationRepository from '@/repositories/application.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';
import { ResourceNotFoundError } from '@/utils/errors';

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
      throw new Error(
        'Application associated with this job posting and user already exists'
      );
    }

    // If all checks passes, return by calling ApplicationRepository.createApplication
    return await ApplicationRepository.createApplication({
      jobPostingId,
      userId,
    });
  },

  getAllApplications: async (userId: string) => {
    return await ApplicationRepository.findApplicationsByUserId(userId);
  },

  getOneApplication: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    // Retrieve application from repository
    const application =
      await ApplicationRepository.findApplicationByIdAndUserId({
        applicationId,
        userId,
      });

    // Check if application is found and belongs authenticated user
    if (!application) {
      throw new ResourceNotFoundError('Application not found.', {
        resource: 'Application',
      });
    }

    return application;
  },
};

export default ApplicationService;
