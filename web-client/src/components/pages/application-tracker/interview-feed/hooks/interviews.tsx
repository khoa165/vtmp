import { InterviewFilter } from '@/components/pages/application-tracker/interview-feed/interview-feed-container';
import { SharedInterviewsResponseSchema } from '@/components/pages/application-tracker/interview-feed/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';

export const useGetSharedInterviews = (interviewFilter: InterviewFilter) =>
  useQuery({
    queryKey: [QueryKey.GET_SHARED_INTERVIEW, interviewFilter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/interviews/shared',
        data: interviewFilter,
        schema: SharedInterviewsResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
  });
