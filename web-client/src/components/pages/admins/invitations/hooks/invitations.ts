import React from 'react';
import { SendInvitationResponseSchema } from '@/components/pages/admins/invitations/validation';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { SystemRole } from '@vtmp/common/constants';
import axios from 'axios';
import { toast } from 'sonner';

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
  setUserInput: React.Dispatch<React.SetStateAction<IInvitationUserInput>>;
  setInputErrors: React.Dispatch<React.SetStateAction<IInvitationInputErrors>>;
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
      setInputErrors({ name: [], email: [] });
      setUserInput({
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
        setInputErrors({
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
