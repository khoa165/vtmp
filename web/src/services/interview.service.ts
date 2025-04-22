import { InterviewRepository } from '@/repositories/interview.repository';
import { InterviewStatus, InterviewType } from '@common/enums';
import { IInterview } from '@/models/interview.model';
import { UpdateResult } from 'mongoose';

export const InterviewService = {
  createInterview: async ({
    applicationId,
    userId,
    type,
    status,
    interviewOnDate,
    note,
  }: {
    applicationId: string;
    userId: string;
    type: InterviewType[];
    status?: InterviewStatus;
    interviewOnDate: Date;
    note?: string;
  }): Promise<IInterview> => {
    return InterviewRepository.createInterview({
      applicationId,
      userId,
      type,
      status: status,
      interviewOnDate,
      note,
    });
  },

  getInterviewById: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    return InterviewRepository.getInterviewById({ interviewId, userId });
  },

  getInterviews: async ({
    userId,
    filters,
  }: {
    userId: string;
    filters: {
      applicationId?: string;
      status?: InterviewStatus;
    };
  }): Promise<IInterview[]> => {
    return InterviewRepository.getInterviews({ userId, filters });
  },

  updateInterviewById: async ({
    interviewId,
    userId,
    updatedMetadata,
  }: {
    interviewId: string;
    userId: string;
    updatedMetadata: {
      type?: InterviewType[];
      status?: InterviewStatus;
      interviewOnDate?: Date;
      note?: string;
    };
  }): Promise<IInterview | null> => {
    return InterviewRepository.updateInterviewById({
      interviewId,
      userId,
      updatedMetadata,
    });
  },

  updateInterviewsWithStatus: async ({
    userId,
    interviewIds,
    updatedStatus,
  }: {
    userId: string;
    interviewIds: string[];
    updatedStatus: InterviewStatus;
  }): Promise<UpdateResult> => {
    return InterviewRepository.updateInterviewsWithStatus({
      userId,
      interviewIds,
      updatedStatus,
    });
  },

  deleteInterviewById: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    return InterviewRepository.deleteInterviewById({ interviewId, userId });
  },
};
