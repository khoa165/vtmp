import { ApplicationStatus } from '@vtmp/common/constants';
import { capitalize } from 'remeda';

export const formatStatus = (status: ApplicationStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};
