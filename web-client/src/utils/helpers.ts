import { ApplicationStatus, LinkStatus } from '@vtmp/common/constants';
import { capitalize } from 'remeda';

export const formatStatus = (status: ApplicationStatus | LinkStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};
