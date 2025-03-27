import Application from '@/models/application.model';

const ApplicationRepository = {
  createApplication: async (applicationData: {
    jobPostingId: string;
    userId: string;
  }) => {
    const newApplication = new Application(applicationData);
    await newApplication.save();
    return newApplication;
  },

  alreadyExist: async (applicationData: {
    jobPostingId: string;
    userId: string;
  }): Promise<boolean> => {
    const { jobPostingId, userId } = applicationData;
    const idIfExist = await Application.exists({
      jobPostingId,
      userId,
    });
    return idIfExist ? true : false;
  },
};

export default ApplicationRepository;
