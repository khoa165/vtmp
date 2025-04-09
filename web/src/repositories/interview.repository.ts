import { InterviewModel } from '@/models/interview.model';

export const InterviewRepository = {
  createInterview: async (applicationId: string) => {
    return InterviewModel.create(applicationId);
  },
  getInterview: async (interviewId: string) => {
    return InterviewModel.findById({ interviewId });
  },
  getInterviewsByUserId: async (userId: string) => {
    return InterviewModel.find({ userId });
  },
  getInterviewsByApplicatonId: async (applicationId: string) => {
    return InterviewModel.find({ applicationId });
  },
  updateInterview: async (interviewId: string) => {
    return InterviewModel.findByIdAndUpdate(interviewId);
  },
  deleteInterview: async (interviewId: string) => {
    return InterviewModel.findByIdAndDelete(interviewId);
  },
};
