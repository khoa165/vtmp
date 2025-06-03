import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  DashBoardLinksResponseSchema,
  JobPostingResponseSchema,
  JobPostingData,
  LinksCountByStatusSchema,
} from '@/components/pages/admins/dashboard/validation';
import axios from 'axios';
import { LinkStatus, API_ENDPOINTS } from '@vtmp/common/constants';

const handleDashBoardMutationError = (error: unknown) => {
  const messages =
    axios.isAxiosError(error) && error.response?.data?.errors
      ? error.response.data.errors.map((e) => e.message)
      : ['Unexpected error occurred'];

  toast.error(messages.join('\n'), {
    style: { whiteSpace: 'pre-line' },
  });
};

const invalidateDashboardQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: [QueryKey.GET_DASHBOARD_LINKS] });
  queryClient.invalidateQueries({
    queryKey: [QueryKey.GET_LINKS_COUNT_BY_STATUS],
  });
};

export const useGetDashBoardLinks = (filter?: { status?: LinkStatus }) =>
  useQuery({
    queryKey: [QueryKey.GET_DASHBOARD_LINKS, filter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: API_ENDPOINTS.GET_DASHBOARD_LINKS,
        data: filter?.status ? filter : {},
        schema: DashBoardLinksResponseSchema,
        options: { includeOnlyDataField: true },
      }),
  });

export const useGetLinksCountByStatus = () =>
  useQuery({
    queryKey: [QueryKey.GET_LINKS_COUNT_BY_STATUS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: API_ENDPOINTS.GET_LINKS_COUNT_BY_STATUS,
        schema: LinksCountByStatusSchema,
        options: { includeOnlyDataField: true },
      }),
  });

export const useApproveDashBoardLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      linkId,
      newUpdate,
    }: {
      linkId: string;
      newUpdate: JobPostingData;
    }) =>
      request({
        method: Method.POST,
        url: API_ENDPOINTS.APPROVE_LINK(linkId),
        data: newUpdate,
        schema: JobPostingResponseSchema,
      }),
    onSuccess: (res) => {
      invalidateDashboardQueries(queryClient);
      toast.success(res.message);
    },
    onError: handleDashBoardMutationError,
  });
};

export const useRejectDashBoardLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId }: { linkId: string }) =>
      request({
        method: Method.POST,
        url: API_ENDPOINTS.REJECT_LINK(linkId),
        schema: JobPostingResponseSchema,
      }),
    onSuccess: (res) => {
      invalidateDashboardQueries(queryClient);
      toast.success(res.message);
    },
    onError: handleDashBoardMutationError,
  });
};
