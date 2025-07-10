import { useQuery } from '@tanstack/react-query';

import {
  InterviewInsightsFilter,
  InterviewInsightsSchema,
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

export const useGetInterviewInsights = (
  interviewFilter: InterviewInsightsFilter
) =>
  useQuery({
    queryKey: [QueryKey.GET_INTERVIEW_INSIGHTS, interviewFilter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/interviews/share/insights',
        data: interviewFilter,
        schema: InterviewInsightsSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
  });
