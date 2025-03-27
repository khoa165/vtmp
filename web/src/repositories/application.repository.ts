import Application from '@/models/application.model';

const ApplicationRepository = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    const newApplication = new Application({ jobPostingId, userId });
    await newApplication.save();
    return newApplication;
  },

  alreadyExist: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }): Promise<boolean> => {
    const idIfExist = await Application.exists({
      jobPostingId,
      userId,
    });
    return idIfExist ? true : false;
  },
};

export default ApplicationRepository;
