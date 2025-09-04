import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { EyeOff, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
import { ResetPasswordResponseSchema } from '@/components/pages/auth/validation';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';

export const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string[]>(
    []
  );
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/request-password-reset');
    }
  }, [token, navigate]);

  const { mutate: resetPasswordFn, isPending } = useMutation({
    mutationFn: (body: { token: string; newPassword: string }) =>
      request({
        method: Method.PATCH,
        url: '/auth/reset-password',
        data: body,
        schema: ResetPasswordResponseSchema,
      }),
    onSuccess: (res) => {
      console.log('Password reset successfully: ', res);
      setIsSuccess(true);
      toast.success('Password has been reset successfully');
    },
    onError: (error) => {
      console.log('Error in reset password', error);
      if (axios.isAxiosError(error) && error.response) {
        setPasswordErrors(
          error.response.data.errors
            .filter((err: { message: string }) =>
              err.message.toLowerCase().includes('password')
            )
            .map((err: { message: string }) => err.message)
        );
      } else {
        toast.error('Reset failed: Unexpected error occurred');
      }
    },
  });

  const handleResetPassword = async () => {
    // Clear previous errors
    setPasswordErrors([]);
    setConfirmPasswordErrors([]);

    // Validation
    if (!passwordInput) {
      setPasswordErrors(['Password is required']);
      return;
    }
    if (!confirmPasswordInput) {
      setConfirmPasswordErrors(['Please confirm your password']);
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setConfirmPasswordErrors(['Passwords do not match']);
      return;
    }
    if (passwordInput.length < 8) {
      setPasswordErrors(['Password must be at least 8 characters long']);
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    resetPasswordFn({ token, newPassword: passwordInput });
  };

  if (isSuccess) {
    return (
      <div className="grid grid-cols-12 gap-4 max-w-screen min-h-screen px-20 py-15 bg-background dark:bg-background">
        <div className="col-start-1 col-span-5 flex flex-col justify-start">
          <TreverseFullLogo className="pl-3 w-[106px] h-[16px]" />
          <Card className="bg-transparent border-0 shadow-none h-full justify-center">
            <CardHeader>
              <CardTitle className="text-5xl font-bold">
                Password Reset
              </CardTitle>
              <CardDescription className="text-xl">
                Your password has been successfully reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 my-3">
              <p className="text-sm text-muted-foreground">
                You can now sign in with your new password.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="text-black w-full" asChild>
                <Link to="/login">Sign In</Link>
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

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="grid grid-cols-12 gap-4 max-w-screen min-h-screen px-20 py-15 bg-background dark:bg-background">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <TreverseFullLogo className="pl-3 w-[106px] h-[16px]" />
        <Card className="bg-transparent border-0 shadow-none h-full justify-center">
          <CardHeader>
            <CardTitle className="text-5xl font-bold">
              Set New Password
            </CardTitle>
            <CardDescription className="text-xl">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="pb-2">
                    New Password
                  </Label>
                  <div className="flex flex-col justify-center relative">
                    <Input
                      id="password"
                      placeholder="Enter new password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordErrors([]);
                      }}
                      errors={passwordErrors}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-1 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      z-index={1}
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword" className="pb-2">
                    Confirm New Password
                  </Label>
                  <div className="flex flex-col justify-center relative">
                    <Input
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPasswordInput}
                      onChange={(e) => {
                        setConfirmPasswordInput(e.target.value);
                        setConfirmPasswordErrors([]);
                      }}
                      errors={confirmPasswordErrors}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-1 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      z-index={1}
                    >
                      {showConfirmPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="text-black w-full"
              onClick={handleResetPassword}
              disabled={isPending}
            >
              {isPending ? 'Resetting...' : 'Reset Password'}
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
