import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  ApplicationsResponseSchema,
  ApplicationResponseSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';
import axios from 'axios';

export const useGetApplications = () => {
  return useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS],
    queryFn: async () => {
      const response = await request(
        Method.GET,
        '/applications',
        null,
        ApplicationsResponseSchema
      );
      return response.data;
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      request(
        Method.DELETE,
        `/applications/${applicationId}`,
        null,
        ApplicationResponseSchema
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
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

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string;
      body: { updatedStatus: ApplicationStatus };
    }) =>
      request(
        Method.PUT,
        `/applications/${applicationId}/updateStatus`,
        body,
        ApplicationResponseSchema
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
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
