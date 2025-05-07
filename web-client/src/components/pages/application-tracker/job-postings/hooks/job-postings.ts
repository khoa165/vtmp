import { useQuery } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { JobPostingsResponseSchema } from '@/components/pages/application-tracker/job-postings/validations';

export const useGetJobPostings = () => {
  return useQuery({
    queryKey: [QueryKey.GET_JOB_POSTINGS],
    queryFn: async () => {
      const response = await request(
        Method.GET,
        '/job-postings',
        null,
        JobPostingsResponseSchema
      );
      return response.data;
    },
  });
};
