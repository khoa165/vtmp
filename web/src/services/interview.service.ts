import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

import { IInterview } from '@/models/interview.model';
import { InterviewRepository } from '@/repositories/interview.repository';
import { ResourceNotFoundError } from '@/utils/errors';

export const InterviewService = {
  createInterview: async (interviewData: {
    applicationId: string;
    userId: string;
    types: InterviewType[];
    status?: InterviewStatus | undefined;
    interviewOnDate: Date;
    note?: string | undefined;
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
    isShared = false,
  }: {
    filters: {
      userId?: string;
      applicationId?: string;
      companyName?: string;
      types?: InterviewType[];
      status?: InterviewStatus;
    };
    isShared?: boolean;
  }): Promise<IInterview[]> => {
    return InterviewRepository.getInterviews({
      filters,
      isShared,
    });
  },

  updateInterviewById: async ({
    interviewId,
    userId,
    newUpdate,
    isShare,
  }: {
    interviewId: string;
    userId: string;
    newUpdate: {
      types?: InterviewType[];
      status?: InterviewStatus;
      interviewOnDate?: Date;
      note?: string;
      isDisclosed?: boolean;
    };
    isShare?: boolean;
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

    if (isShare !== undefined) {
      if (isShare) {
        if (!interview.sharedAt) {
          return await InterviewRepository.updateInterviewById({
            interviewId,
            userId,
            newUpdate: {
              ...newUpdate,
              sharedAt: new Date(),
            },
          });
        }
      } else {
        return await InterviewRepository.updateInterviewById({
          interviewId,
          userId,
          newUpdate: {
            isDisclosed: true,
            sharedAt: null,
          },
        });
      }
    }

    return await InterviewRepository.updateInterviewById({
      interviewId,
      userId,
      newUpdate: newUpdate,
    });
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
