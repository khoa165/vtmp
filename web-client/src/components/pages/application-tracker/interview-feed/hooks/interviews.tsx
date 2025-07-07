import { useQuery } from '@tanstack/react-query';

import {
  SharedInterviewFilter,
  SharedInterviewsResponseSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';

export const useGetSharedInterviews = (
  interviewFilter: SharedInterviewFilter
) =>
  useQuery({
    queryKey: [QueryKey.GET_SHARED_INTERVIEW, interviewFilter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/interviews/share',
        data: interviewFilter,
        schema: SharedInterviewsResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
  });
