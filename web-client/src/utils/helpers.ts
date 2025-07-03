import { capitalize } from 'remeda';

import { ApplicationStatus } from '@vtmp/common/constants';

export const formatStatus = (status: ApplicationStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};
