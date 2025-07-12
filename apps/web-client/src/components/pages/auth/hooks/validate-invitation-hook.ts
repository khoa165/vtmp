import { request } from '@/utils/api';
import { Method } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { InvitationResponseSchema } from '@/components/pages/auth/validation';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';

export const useValidateInvitation = () => {
  const navigate = useNavigatePreserveQueryParams();
  return useMutation({
    mutationFn: (body: { token: string }) =>
      request({
        method: Method.POST,
        url: '/auth/validate',
        data: body,
        schema: InvitationResponseSchema,
      }),
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((err: { message: string }) => {
          if (err.message.toLocaleLowerCase() === 'Invitation has expired') {
            toast.error('Invitation has expired');
          }

          if (err.message.toLocaleLowerCase().includes('jwt')) {
            toast.error('The Invitation is invalid');
          }
        });
      } else {
        toast.error('Signup failed: Unexpected error occured');
      }
      navigate('/404');
    },
  });
};
