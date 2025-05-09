import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  DashBoardLinkResponseSchema,
  DashBoardLinksResponseSchema,
  JobPostingResponseSchema,
} from '@/components/pages/admins/dashboard/validation';
import axios from 'axios';

export const useGetDashBoardLinks = () => {
  return useQuery({
    queryKey: [QueryKey.GET_DASHBOARD_LINKS],
    queryFn: async () => {
      const response = await request({
        method: Method.GET,
        url: '/links',
        schema: DashBoardLinksResponseSchema,
      });
      return response.data;
    },
  });
};

export const useGetDashBoardLinkById = (linkId: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_DASHBOARD_LINKS],
    queryFn: async () => {
      const response = await request({
        method: Method.GET,
        url: `/links/getLink/${linkId}`,
        schema: DashBoardLinkResponseSchema,
      });
      return response.data;
    },
  });
};

export const useApproveDashBoardLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      linkId,
      newUpdate,
    }: {
      linkId: string;
      newUpdate: object;
    }) =>
      request({
        method: Method.POST,
        url: `/links/${linkId}/approve`,
        data: newUpdate,
        schema: JobPostingResponseSchema,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_DASHBOARD_LINKS],
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
        console.log(error);
        toast.error('Unexpected error');
      }
    },
  });
};

export const useRejectDashBoardLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId }: { linkId: string }) =>
      request({
        method: Method.POST,
        url: `/links/${linkId}/reject`,
        schema: JobPostingResponseSchema,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_DASHBOARD_LINKS],
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
