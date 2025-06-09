import { capitalize } from 'remeda';

import { ApplicationStatus, LinkStatus } from '@vtmp/common/constants';

export const formatStatus = (status: ApplicationStatus | LinkStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};
