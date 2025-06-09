import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import {
  LinksResponseSchema,
  JobPostingResponseSchema,
  JobPostingData,
  LinksCountByStatusSchema,
} from '@/components/pages/admins/links/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { LinkStatus, API_ENDPOINTS } from '@vtmp/common/constants';

const handleLinkMutationError = (error: unknown) => {
  const messages =
    axios.isAxiosError(error) && error.response?.data?.errors
      ? error.response.data.errors.map((e) => e.message)
      : ['Unexpected error occurred'];

  toast.error(messages.join('\n'), {
    style: { whiteSpace: 'pre-line' },
  });
};

const invalidateLinkQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: [QueryKey.GET_LINKS] });
  queryClient.invalidateQueries({
    queryKey: [QueryKey.GET_LINKS_COUNT_BY_STATUS],
  });
};

export const useGetLinks = (filter?: { status?: LinkStatus }) =>
  useQuery({
    queryKey: [QueryKey.GET_LINKS, filter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: API_ENDPOINTS.GET_LINKS,
        data: filter?.status ? filter : {},
        schema: LinksResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
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
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
  });

export const useApproveLink = () => {
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
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      invalidateLinkQueries(queryClient);
      toast.success(res.message);
    },
    onError: handleLinkMutationError,
  });
};

export const useRejectLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId }: { linkId: string }) =>
      request({
        method: Method.POST,
        url: API_ENDPOINTS.REJECT_LINK(linkId),
        schema: JobPostingResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      invalidateLinkQueries(queryClient);
      toast.success(res.message);
    },
    onError: handleLinkMutationError,
  });
};
