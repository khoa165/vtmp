import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  ApplicationsResponseSchema,
  ApplicationResponseSchema,
  ApplicationsCountByStatusSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';
import axios from 'axios';

export const useGetApplications = (
  applicationFilter: { status?: ApplicationStatus } = {}
) =>
  useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS, applicationFilter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/applications',
        data: applicationFilter,
        schema: ApplicationsResponseSchema,
        options: { includeOnlyDataField: true },
      }),
  });

export const useGetApplicationsCountByStatus = () =>
  useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/applications/count-by-status',
        schema: ApplicationsCountByStatusSchema,
        options: { includeOnlyDataField: true },
      }),
  });

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      request({
        method: Method.DELETE,
        url: `/applications/${applicationId}`,
        schema: ApplicationResponseSchema,
      }),
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
      request({
        method: Method.PUT,
        url: `/applications/${applicationId}/updateStatus`,
        data: body,
        schema: ApplicationResponseSchema,
      }),
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
