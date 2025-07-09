import {
  InterviewShareStatus,
  InterviewStatus,
  InterviewType,
} from '@vtmp/common/constants';

import { IInterview } from '@/models/interview.model';
import { InterviewRepository } from '@/repositories/interview.repository';
import { BadRequest, ResourceNotFoundError } from '@/utils/errors';

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
  }: {
    interviewId: string;
    userId: string;
    newUpdate: {
      types?: InterviewType[];
      status?: InterviewStatus;
      interviewOnDate?: Date;
      note?: string;
    };
  }): Promise<IInterview | null> => {
    const updatedInterview = await InterviewRepository.updateInterviewById({
      interviewId,
      userId,
      newUpdate: newUpdate,
    });

    if (!updatedInterview) {
      throw new ResourceNotFoundError('Interview not found', {
        interviewId,
        userId,
      });
    }

    return updatedInterview;
  },

  updateInterviewShareStatus: async ({
    interviewId,
    userId,
    shareStatus,
  }: {
    interviewId: string;
    userId: string;
    shareStatus: InterviewShareStatus;
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

    if (
      interview.shareStatus !== InterviewShareStatus.UNSHARED &&
      shareStatus === InterviewShareStatus.UNSHARED
    ) {
      throw new BadRequest(
        'Cannot unshare an interview that is already shared',
        {
          interviewId,
          userId,
        }
      );
    }

    return await InterviewRepository.updateInterviewById({
      interviewId,
      userId,
      newUpdate: { shareStatus },
    });
  },

  deleteInterviewById: async ({
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

    if (interview.shareStatus !== InterviewShareStatus.UNSHARED) {
      throw new BadRequest('Cannot delete a shared interview', {
        interviewId,
        userId,
      });
    }

    const deletedInterview = await InterviewRepository.deleteInterviewById({
      interviewId,
      userId,
    });

    return deletedInterview;
  },
};
