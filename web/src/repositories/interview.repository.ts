import { InterviewModel } from '@/models/interview.model';

export const InterviewRepository = {
  createInterview: async (applicationId: string) => {
    return InterviewModel.create(applicationId);
  },
  getInterviewByApplicatonId: async (applicationId: string) => {
    return InterviewModel.find({ applicationId });
  },
  getInterviewByStatus: async ({ status }: { status: string }) => {
    return InterviewModel.find({ status: status });
  },
  updateInterviewWithStatus: async ({}) => {},
};
