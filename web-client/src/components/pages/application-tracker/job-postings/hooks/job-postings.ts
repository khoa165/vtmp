import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { sub } from 'date-fns';
import { toast } from 'sonner';

import { useLogout } from '#vtmp/web-client/hooks/useLogout';
import { ApplicationResponseSchema } from '@/components/pages/application-tracker/applications/validation';
import { JobPostingsResponseSchema } from '@/components/pages/application-tracker/job-postings/validations';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';

export const useGetJobPostings = () => {
  return useQuery({
    queryKey: [QueryKey.GET_JOB_POSTINGS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/job-postings/not-applied',
        schema: JobPostingsResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
  });
};

export const useGetJobPostingsInADay = () => {
  return useQuery({
    queryKey: [QueryKey.GET_JOB_POSTINGS_IN_ADAY],
    queryFn: () =>
      request({
        method: Method.GET,
        data: {
          postingDateRangeStart: sub(Date.now(), { days: 1 }),
          postingDateRangeEnd: new Date(),
        },
        url: '/job-postings/not-applied',
        schema: JobPostingsResponseSchema,
        options: {
          includeOnlyDataField: true,
          requireAuth: true,
        },
      }),
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { jobPostingId: string }) =>
      request({
        method: Method.POST,
        url: '/applications',
        data: body,
        schema: ApplicationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_JOB_POSTINGS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
      });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      const { logout } = useLogout();
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) logout();
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};
