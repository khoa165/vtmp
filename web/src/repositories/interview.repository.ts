import { InterviewModel } from '@/models/interview.model';

export const InterviewRepository = {
  createInterview: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    return InterviewModel.create({ applicationId, userId });
  },
  getInterview: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }) => {
    return InterviewModel.findById({ interviewId, userId });
  },
  getInterviews: async (userId: string) => {
    return InterviewModel.find({ userId });
  },
  getInterviewsByApplicatonId: async ({
    applicationId,
    userId,
  }: {
    applicationId: string;
    userId: string;
  }) => {
    return InterviewModel.find({ applicationId, userId });
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
      { _id: interviewId, userId },
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
    return InterviewModel.findOneAndDelete({ interviewId, userId });
  },
};
