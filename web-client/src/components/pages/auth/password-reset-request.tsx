import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/base/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/base/dialog';
import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';

interface PasswordResetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ErrorResponse {
  response?: {
    data?: {
      errors?: { message: string }[];
    };
  };
}

// Simple schema for password reset request response
const PasswordResetRequestSchema = z.object({
  data: z.object({
    reqPasswordReset: z.any(),
  }),
  message: z.string(),
});

export const PasswordResetRequestModal = ({
  isOpen,
  onClose,
}: PasswordResetRequestModalProps) => {
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const { mutate: requestPasswordReset, isPending } = useMutation({
    mutationFn: async (body: { email: string }) => {
      return request({
        method: Method.POST,
        url: '/auth/request-password-reset',
        data: body,
        schema: PasswordResetRequestSchema,
      });
    },
    onSuccess: () => {
      toast.success(
        'If an account exists with this email, you will receive a password reset link shortly.'
      );
      setEmail('');
      setEmailErrors([]);
      onClose();
    },
    onError: (error: ErrorResponse) => {
      if (error?.response?.data?.errors) {
        const emailError = error.response.data.errors.find((err) =>
          err.message.toLowerCase().includes('email')
        );
        if (emailError) {
          setEmailErrors([emailError.message]);
        } else {
          toast.error('Failed to send password reset email');
        }
      } else {
        toast.error('Failed to send password reset email');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailErrors(['Email is required']);
      return;
    }
    setEmailErrors([]);
    requestPasswordReset({ email });
  };

  const handleClose = () => {
    setEmail('');
    setEmailErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter your email address and we'll send you a link to reset your
            password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErrors([]);
              }}
              errors={emailErrors}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
