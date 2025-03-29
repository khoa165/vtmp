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
};

export default ApplicationService;
