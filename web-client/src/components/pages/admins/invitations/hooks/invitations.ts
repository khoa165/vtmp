import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { SystemRole } from '@vtmp/common/constants';

import {
  SendInvitationResponseSchema,
  InvitationSchema,
} from '@/components/pages/admins/invitations/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';

export interface IInvitationUserInput {
  name: string;
  email: string;
  role: SystemRole;
}

export interface IInvitationInputErrors {
  name: string[];
  email: string[];
}

export const useSendInvitation = ({
  setUserInput,
  setInputErrors,
}: {
  setUserInput?: React.Dispatch<React.SetStateAction<IInvitationUserInput>>;
  setInputErrors?: React.Dispatch<React.SetStateAction<IInvitationInputErrors>>;
}) => {
  return useMutation({
    mutationFn: (body: {
      receiverName: string;
      receiverEmail: string;
      senderId: string;
      role?: SystemRole;
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
      setInputErrors?.({ name: [], email: [] });
      setUserInput?.({
        name: '',
        email: '',
        role: SystemRole.USER,
      });
    },
    onError: (error) => {
      console.log('Error in useMutation sendInvitation');
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (e: { message: string }) => e.message
        );
        const { emailRelatedErrors, otherErrors } = errorMessages.reduce(
          (
            acc: { emailRelatedErrors: string[]; otherErrors: string[] },
            errMsg: string
          ) => {
            if (
              errMsg.toLowerCase().includes('email') ||
              errMsg.toLowerCase().includes('user')
            ) {
              acc.emailRelatedErrors.push(errMsg);
            } else {
              acc.otherErrors.push(errMsg);
            }
            return acc;
          },
          { emailRelatedErrors: [], otherErrors: [] }
        );
        setInputErrors?.({
          name: otherErrors,
          email: emailRelatedErrors,
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
