import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  DashBoardLinkResponseSchema,
  DashBoardLinksResponseSchema,
  IDashBoardLink,
} from '@/components/pages/admins/dashboard/validation';
import axios from 'axios';

export const useGetDashBoardLinks = () => {
  return useQuery({
    queryKey: [QueryKey.GET_DASHBOARD_LINKS],
    queryFn: async () => {
      const response = await request(
        Method.GET,
        '/links',
        null,
        DashBoardLinksResponseSchema
      );
      return response.data;
    },
  });
};

export const useUpdateDashBoardLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      linkId,
      newUpdate,
    }: {
      linkId: string;
      newUpdate: Partial<IDashBoardLink>;
    }) =>
      request(
        Method.PUT,
        `/links/${linkId}`,
        newUpdate,
        DashBoardLinkResponseSchema
      ),
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
