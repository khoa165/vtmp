import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  SendInvitationResponseSchema,
  InvitationSchema,
} from '@/components/pages/admins/invitations/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';

export interface IInvitationUserInput {
  name: string;
  email: string;
}

export const useSendInvitation = ({
  setUserInput,
}: {
  setUserInput?: React.Dispatch<React.SetStateAction<IInvitationUserInput>>;
}) => {
  return useMutation({
    mutationFn: (body: {
      receiverName: string;
      receiverEmail: string;
      senderId: string;
      webUrl: string;
    }) =>
      request({
        method: Method.POST,
        url: '/invitations',
        data: body,
        schema: SendInvitationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: () => {
      console.log('Success in useMutation sendInvitation');
      toast.success('Invitation sent successfully!');
      setUserInput?.({
        name: '',
        email: '',
      });
    },
    onError: (error) => {
      console.log('Error in useMutation sendInvitation', error);
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((e: { message: string }) => {
          toast.error(e.message);
        });
      } else {
        console.log('Unexpected error', error);
        toast.error('Sending invitation failed: Unexpected error occured');
      }
    },
  });
};

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
