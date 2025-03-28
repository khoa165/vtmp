import ApplicationRepository from '@/repositories/application.repository';
import JobPostingRepository from '@/repositories/jobPosting.repository';

const ApplicationService = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    // Check if postingId exists in database
    const jobPosting = await JobPostingRepository.findById(jobPostingId);
    if (!jobPosting) {
      throw new Error('Job posting does not exist');
    }

    // Check if an application associated with this job posting and user already exist
    const alreadyExists = await ApplicationRepository.alreadyExist({
      jobPostingId,
      userId,
    });
    if (alreadyExists) {
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

  getAllApplications: async ({ userId }: { userId: string }) => {
    return ApplicationRepository.findApplicationsByUserId({ userId });
  },

  getOneApplication: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    // Retrieve application from repository
    const application = ApplicationRepository.findApplicationByIdAndUserId({
      applicationId,
      userId,
    });

    // Check if application is found and belongs authenticated user
    if (!application) {
      throw new Error('Application not found or access denied.');
    }

    return application;
  },
};

export default ApplicationService;
