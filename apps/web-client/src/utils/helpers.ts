import { capitalize } from 'remeda';

import {
  ApplicationStatus,
  InterviewStatus,
  InterviewType,
} from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

export const formatStatus = (status: ApplicationStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};

export const getClientOrigin = (): string => window.location.origin;

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
    label: formatEnumName(type),
    value: type,
  })
);
