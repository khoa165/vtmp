import React from 'react';
import { SendInvitationResponseSchema } from '@/components/pages/admins/invitations/validation';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { UserRole } from '@vtmp/common/constants';
import axios from 'axios';
import { toast } from 'sonner';

export const useSendInvitation = ({
  setSendInvitationErrors,
  setEmailErrors,
  setNameErrors,
  setNameInput,
  setEmailInput,
  setRoleInput,
}: {
  setSendInvitationErrors: React.Dispatch<React.SetStateAction<string[]>>;
  setEmailErrors: React.Dispatch<React.SetStateAction<string[]>>;
  setNameErrors: React.Dispatch<React.SetStateAction<string[]>>;
  setNameInput: React.Dispatch<React.SetStateAction<string>>;
  setEmailInput: React.Dispatch<React.SetStateAction<string>>;
  setRoleInput: React.Dispatch<React.SetStateAction<UserRole>>;
}) => {
  return useMutation({
    mutationFn: (body: {
      receiverName: string;
      receiverEmail: string;
      senderId: string;
      role?: UserRole;
    }) =>
      request({
        method: Method.POST,
        url: '/invitations',
        data: body,
        schema: SendInvitationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      console.log('Success in useMutation sendInvitation');
      toast.success('Invitation sent successfully!');
      setSendInvitationErrors([]);
      setEmailErrors([]);
      setNameErrors([]);
      setNameInput('');
      setEmailInput('');
      setRoleInput(UserRole.USER);
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
        setEmailErrors(emailRelatedErrors);
        setSendInvitationErrors(otherErrors);
      } else {
        console.log('Unexpected error', error);
        toast.error('Sending invitation failed: Unexpected error occured');
      }
    },
  });
};
