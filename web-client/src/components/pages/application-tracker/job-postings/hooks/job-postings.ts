import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { JobPostingsResponseSchema } from '@/components/pages/application-tracker/job-postings/validations';
import { ApplicationResponseSchema } from '@/components/pages/application-tracker/applications/validation';
import { toast } from 'sonner';
import axios from 'axios';
import { sub } from 'date-fns';
import { FilterState } from '@/components/pages/application-tracker/job-postings/job-postings-drawer';

export const useGetJobPostings = (filters?: FilterState) => {
  return useQuery({
    queryKey: [QueryKey.GET_JOB_POSTINGS, filters],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/job-postings/not-applied',
        data: filters ?? {},
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
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
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
