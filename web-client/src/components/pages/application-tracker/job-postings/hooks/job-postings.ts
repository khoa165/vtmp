import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { JobPostingsResponseSchema } from '@/components/pages/application-tracker/job-postings/validations';
import { ApplicationResponseSchema } from '@/components/pages/application-tracker/applications/validation';
import { toast } from 'sonner';
import axios from 'axios';

export const useGetJobPostings = () => {
  return useQuery({
    queryKey: [QueryKey.GET_JOB_POSTINGS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/job-postings/not-applied',
        schema: JobPostingsResponseSchema,
        options: { includeOnlyDataField: true },
      }),
  });
};

export const useGetJobPostingsInADay = () => {
  return useQuery({
    queryKey: [QueryKey.GET_JOB_POSTINGS_IN_ADAY],
    queryFn: async () => {
      const response = await request({
        method: Method.GET,
        url: '/job-postings/not-applied-last-24h',
        schema: JobPostingsResponseSchema,
      });
      return response.data;
    },
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
