import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { TreverseFullLogo } from '#vtmp/web-client/components/base/treverse-full-logo';
import { Button } from '@/components/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { RequestPasswordResetResponseSchema } from '@/components/pages/auth/validation';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';

export const RequestPasswordResetPage = () => {
  const [emailInput, setEmailInput] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: requestPasswordResetFn, isPending } = useMutation({
    mutationFn: (body: { email: string }) =>
      request({
        method: Method.POST,
        url: '/auth/request-password-reset',
        data: body,
        schema: RequestPasswordResetResponseSchema,
      }),
    onSuccess: (res) => {
      console.log('Password reset request sent successfully: ', res);
      setIsSubmitted(true);
      toast.success(
        'If the account exists with this email, you will receive a password reset link via email'
      );
    },
    onError: (error) => {
      console.log('Error in request password reset', error);
      if (axios.isAxiosError(error) && error.response) {
        setEmailErrors(
          error.response.data.errors
            .filter((err: { message: string }) =>
              err.message.toLowerCase().includes('email')
            )
            .map((err: { message: string }) => err.message)
        );
      } else {
        toast.error('Request failed: Unexpected error occurred');
      }
    },
  });

  const handleRequestReset = async () => {
    if (!emailInput) {
      setEmailErrors(['Email is required']);
      return;
    }
    requestPasswordResetFn({ email: emailInput });
  };

  if (isSubmitted) {
    return (
      <div className="grid grid-cols-12 gap-4 max-w-screen min-h-screen px-20 py-15 bg-background dark:bg-background">
        <div className="col-start-1 col-span-5 flex flex-col justify-start">
          <TreverseFullLogo className="pl-3 w-[106px] h-[16px]" />
          <Card className="bg-transparent border-0 shadow-none h-full justify-center">
            <CardHeader>
              <CardTitle className="text-5xl font-bold">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-xl">
                We've sent a password reset link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 my-3">
              <p className="text-sm text-muted-foreground">
                If you don't see the email in your inbox, please check your spam
                folder. The link will expire in 1 hour.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button variant="link" asChild>
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="col-start-7 col-span-6">
          <div className="magic-pattern px-15 py-15 rounded-[33px]">
            <div className="relative h-full w-xs">
              <p className="text-6xl text-black font-bold absolute bottom-0">
                For Viet Tech, By Viet Tech
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 max-w-screen min-h-screen px-20 py-15 bg-background dark:bg-background">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <TreverseFullLogo className="pl-3 w-[106px] h-[16px]" />
        <Card className="bg-transparent border-0 shadow-none h-full justify-center">
          <CardHeader>
            <CardTitle className="text-5xl font-bold">Reset Password</CardTitle>
            <CardDescription className="text-xl">
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="pb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email address"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailErrors([]);
                    }}
                    errors={emailErrors}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="text-black w-full"
              onClick={handleRequestReset}
              disabled={isPending}
            >
              {isPending ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button variant="link" asChild>
              <Link to="/login">Back to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="col-start-7 col-span-6">
        <div className="magic-pattern px-15 py-15 rounded-[33px]">
          <div className="relative h-full w-xs">
            <p className="text-6xl text-black font-bold absolute bottom-0">
              For Viet Tech, By Viet Tech
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
