import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  DashBoardLinkResponseSchema,
  DashBoardLinksResponseSchema,
  JobPostingResponseSchema,
  LinksCountByStatusSchema,
} from '@/components/pages/admins/dashboard/validation';
import axios from 'axios';
import { LinkStatus } from '@vtmp/common/constants';

export const useGetDashBoardLinks = (filter: { status?: LinkStatus } = {}) => {
  return useQuery({
    queryKey: [QueryKey.GET_DASHBOARD_LINKS, filter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/links',
        schema: DashBoardLinksResponseSchema,
        data: filter,
        options: { includeOnlyDataField: true },
      }),
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

export const useGetLinksCountByStatus = () =>
  useQuery({
    queryKey: [QueryKey.GET_LINKS_COUNT_BY_STATUS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/links/count-by-status',
        schema: LinksCountByStatusSchema,
        options: { includeOnlyDataField: true },
      }),
  });
