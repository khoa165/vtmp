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

  findApplicationsByUserId: async ({ userId }: { userId: string }) => {
    const applications = await Application.find({
      userId: new mongoose.Types.ObjectId(userId),
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
    return await Application.findOne({
      _id: new mongoose.Types.ObjectId(applicationId),
      userId: new mongoose.Types.ObjectId(userId),
    });
  },
};

export default ApplicationRepository;
