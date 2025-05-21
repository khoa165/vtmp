import { ApplicationStatus, LinkStatus } from '@vtmp/common/constants';
import { capitalize } from 'remeda';

export const formatStatus = (status: ApplicationStatus | LinkStatus) => {
  return status === ApplicationStatus.OA ? status : capitalize(status);
};

export const getEndPointWithId = (endPoint: string, id: string): string => {
  const endPointWithId = endPoint.replace(/:([a-zA-Z_]+)/g, id);
  return endPointWithId;
};
