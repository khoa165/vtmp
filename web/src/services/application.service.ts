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
    // Step 1: extract userId and postingId

    // Step 2: call UserRepository.findById(id) to see if userId exists in database, otherwise throw error  ⇒ could be extracted to middleware

    // Step 3: call PostingRepository.findById(id) to see if postingId exists in database, otherwise throw error
    const jobPosting = await JobPostingRepository.findById(jobPostingId);
    if (!jobPosting) {
      throw new Error('Job posting not found');
    }

    // Step 4: call ApplicationRepository.alreadyExist({userId, postingId})
    const alreadyExists = await ApplicationRepository.alreadyExist({
      jobPostingId,
      userId,
    });
    if (alreadyExists) {
      throw new Error('Application already exists');
    }

    // Step 5: If all check above passes, return ApplicationRepository.createApplication(applicationData)
    return ApplicationRepository.createApplication({
      jobPostingId,
      userId,
    });
  },
};

export default ApplicationService;
