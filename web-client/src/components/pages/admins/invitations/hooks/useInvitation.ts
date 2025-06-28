import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InvitationSchema } from '@/components/pages/admins/users/invitation-dashboard/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import axios from 'axios';
import { z } from 'zod';

const InvitationsResponseSchema = z.object({
  data: z.array(InvitationSchema),
});

const InvitationResponseSchema = z.object({
  data: InvitationSchema,
});

export const useGetInvitations = () => {
  return useQuery({
    queryKey: [QueryKey.GET_INVITATIONS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/invitations',
        schema: InvitationsResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
  });
};

export const useSendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      receiverName: string;
      receiverEmail: string;
      senderId: string;
    }) => {
      return request({
        method: Method.POST,
        url: '/invitations',
        data,
        schema: InvitationResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_INVITATIONS] });
      toast.success('Invitation sent successfully');
    },
    onError: (error) => {
      console.error('Error sending invitation:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.errors?.[0]?.message ||
            `Failed to send invitation`
        );
      } else {
        toast.error(`Failed to send invitation`);
      }
    },
  });
};

export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      request({
        method: Method.PUT,
        url: `/invitations/${invitationId}/revoke`,
        schema: InvitationResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_INVITATIONS] });
      toast.success('Invitation revoked successfully');
    },
    onError: (error) => {
      console.error('Error revoking invitation:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.errors?.[0]?.message ||
            'Failed to revoke invitation'
        );
      } else {
        toast.error('Failed to revoke invitation');
      }
    },
  });
};
