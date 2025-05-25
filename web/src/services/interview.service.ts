import { InterviewRepository } from '@/repositories/interview.repository';
import { IInterview } from '@/models/interview.model';

import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { ResourceNotFoundError } from '@/utils/errors';

export const InterviewService = {
  createInterview: async (interviewData: {
    applicationId: string;
    userId: string;
    type: InterviewType[];
    status?: InterviewStatus;
    interviewOnDate: Date;
    note?: string;
  }): Promise<IInterview> => {
    return InterviewRepository.createInterview(interviewData);
  },

  getInterviewById: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    const interview = await InterviewRepository.getInterviewById({
      interviewId,
      userId,
    });

    if (!interview) {
      throw new ResourceNotFoundError('Interview not found', {
        interviewId,
        userId,
      });
    }

    return interview;
  },

  getInterviews: async ({
    filters = {},
  }: {
    filters: {
      userId?: string;
      applicationId?: string;
      status?: InterviewStatus;
      companyName?: string;
    };
  }): Promise<IInterview[]> => {
    return InterviewRepository.getInterviews({ filters });
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
    const updatedInterview = await InterviewRepository.updateInterviewById({
      interviewId,
      userId,
      updatedMetadata,
    });

    if (!updatedInterview) {
      throw new ResourceNotFoundError('Interview not found', {
        interviewId,
        userId,
      });
    }

    return updatedInterview;
  },

  deleteInterviewById: async ({
    interviewId,
    userId,
  }: {
    interviewId: string;
    userId: string;
  }): Promise<IInterview | null> => {
    const deletedInterview = await InterviewRepository.deleteInterviewById({
      interviewId,
      userId,
    });

    if (!deletedInterview) {
      throw new ResourceNotFoundError('Interview not found', {
        interviewId,
        userId,
      });
    }

    return deletedInterview;
  },
};
