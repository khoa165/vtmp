import ApplicationModel from '@/models/application.model';

const ApplicationRepository = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    return await ApplicationModel.create({
      jobPostingId,
      userId,
    });
  },

  doesApplicationExist: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    return !!(await ApplicationModel.exists({
      jobPostingId,
      userId,
    }));
  },

  findApplicationsByUserId: async (userId: string) => {
    const applications = await ApplicationModel.find({
      userId: userId,
    });
    return applications;
  },

  findApplicationByIdAndUserId: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    return await ApplicationModel.findOne({
      _id: applicationId,
      userId: userId,
    });
  },
};

export default ApplicationRepository;
