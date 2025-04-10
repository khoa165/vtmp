import { InterviewModel } from '@/models/interview.model';

export const InterviewRepository = {
  createInterview: async (interviewData: object) => {
    return InterviewModel.create(interviewData);
  },

  getInterview: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }) => {
    return InterviewModel.findOne({
      _id: interviewId,
      userId: userId,
      deletedAt: null,
    });
  },

  getInterviews: async (userId: string) => {
    return InterviewModel.find({ userId: userId, deletedAt: null });
  },

  getInterviewsByApplicatonId: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    return InterviewModel.find({
      applicationId: applicationId,
      userId: userId,
      deletedAt: null,
    });
  },

  updateInterview: async ({
    interviewId,
    userId,
    newUpdate,
  }: {
    interviewId: string;
    userId: string;
    newUpdate: object;
  }) => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId: userId, deletedAt: null },
      { $set: newUpdate },
      { new: true }
    );
  },

  deleteInterview: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }) => {
    return InterviewModel.findOneAndUpdate(
      { _id: interviewId, userId: userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
  },
};
