import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  ApplicationsResponseSchema,
  ApplicationResponseSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';

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
      console.log('Successfully deleted an application');
      toast.success(res.message);
    },
    onError: (error) => {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application.');
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
      console.log('Successfully updated application status');
      toast.success(res.message);
    },
    onError: (error) => {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status.');
    },
  });
};
