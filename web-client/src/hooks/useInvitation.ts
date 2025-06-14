import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { InvitationSchema } from '@/components/pages/admins/users/invitation-dashboard/validation';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';
import { toast } from 'sonner';
import axios from 'axios';
import { z } from 'zod';

const InvitationsResponseSchema = z.object({
  data: z.array(InvitationSchema),
});

const InvitationResponseSchema = z.object({
  data: InvitationSchema,
});

const INVITATION_KEYS = {
  all: ['invitations'] as const,
  lists: () => [...INVITATION_KEYS.all, 'list'] as const,
  detail: (id: string) => [...INVITATION_KEYS.all, 'detail', id] as const,
};

export const useGetInvitations = () => {
  return useQuery({
    queryKey: INVITATION_KEYS.lists(),
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
      receiverName?: string;
      receiverEmail?: string;
      senderId?: string;
      isResend?: boolean;
      invitationId?: string;
    }) => {
      const { isResend, invitationId, ...sendData } = data;

      if (isResend && invitationId) {
        return request({
          method: Method.POST,
          url: `/invitations/${invitationId}/resend`,
          schema: InvitationResponseSchema,
          options: { includeOnlyDataField: true, requireAuth: true },
        });
      } else {
        return request({
          method: Method.POST,
          url: '/invitations',
          data: sendData,
          schema: InvitationResponseSchema,
          options: { includeOnlyDataField: true, requireAuth: true },
        });
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.lists() });
      const isResend = variables.isResend;
      toast.success(
        isResend
          ? 'Invitation resent successfully'
          : 'Invitation sent successfully'
      );
    },
    onError: (error, variables) => {
      console.error('Error sending invitation:', error);
      const isResend = variables.isResend;
      const action = isResend ? 'resend' : 'send';

      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.errors?.[0]?.message ||
            `Failed to ${action} invitation`
        );
      } else {
        toast.error(`Failed to ${action} invitation`);
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
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.lists() });
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

export const useResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      request({
        method: Method.POST,
        url: `/invitations/${invitationId}/resend`,
        schema: InvitationResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.lists() });
      toast.success('Invitation resent successfully');
    },
    onError: (error) => {
      console.error('Error resending invitation:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.errors?.[0]?.message ||
            'Failed to resend invitation'
        );
      } else {
        toast.error('Failed to resend invitation');
      }
    },
  });
};
