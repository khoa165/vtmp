import {
  ApplicationStatus,
  InterestLevel,
  InterviewStatus,
  InterviewType,
  LinkStatus,
} from '@vtmp/common/constants';
import { capitalize } from 'remeda';

export const formatStatus = (status: ApplicationStatus | LinkStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};

export const formatInterestLevel = (interest: InterestLevel) => {
  return capitalize(interest);
};

export const formatInterviewType = (type: InterviewType) => {
  return capitalize(type);
};

export const formatInterviewStatus = (status: InterviewStatus) => {
  return capitalize(status);
};
