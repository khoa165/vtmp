import { ApplicationStatus } from '@vtmp/common/constants';

export const titleCase = (word: string): string => {
  if (!word) {
    return '';
  }
  const wordLowerCase = word.toLowerCase();
  return wordLowerCase.charAt(0).toUpperCase() + wordLowerCase.slice(1);
};

export const formatStatus = (status: ApplicationStatus) => {
  return status === ApplicationStatus.OA ? status : titleCase(status);
};
