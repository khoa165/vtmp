import Application from '@/models/application.model';
import mongoose from 'mongoose';

const ApplicationRepository = {
  createApplication: async ({
    jobPostingId,
    userId,
  }: {
    jobPostingId: string;
    userId: string;
  }) => {
    const newApplication = new Application({
      jobPostingId: new mongoose.Types.ObjectId(jobPostingId),
      userId: new mongoose.Types.ObjectId(userId),
    });
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
      jobPostingId: new mongoose.Types.ObjectId(jobPostingId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    return idIfExist ? true : false;
  },
};

export default ApplicationRepository;
