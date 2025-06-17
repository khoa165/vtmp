import {
  ApplicationStatus,
  InterviewStatus,
  InterviewType,
  LinkStatus,
} from '@vtmp/common/constants';
import { capitalize } from 'remeda';

export const formatStatus = (status: ApplicationStatus | LinkStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};

export const convertToInterviewStatusEnum = (
  str: string
): InterviewStatus | undefined => {
  return InterviewStatus[str as keyof typeof InterviewStatus];
};

export const convertToInterviewType = (
  str: string
): InterviewType | undefined => {
  return InterviewType[str as keyof typeof InterviewType];
};

export const interviewTypeOptions = Object.values(InterviewType).map(
  (type) => ({
    label: type.toString(),
    value: type,
  })
);
