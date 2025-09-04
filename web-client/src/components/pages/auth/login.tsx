import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { EyeOff, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { SystemRole } from '@vtmp/common/constants';

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
import { Checkbox } from '@/components/base/checkbox';
import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { AuthResponseSchema } from '@/components/pages/auth/validation';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';

export const LoginPage = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/jobs" />;
  }

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const redirected = searchParams.get('redirected');
    if (redirected) {
      toast.warning('Please login to your account to continue');
      searchParams.delete('redirected');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigatePreserveQueryParams();

  const { mutate: loginFn } = useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      request({
        method: Method.POST,
        url: '/auth/login',
        data: body,
        schema: AuthResponseSchema,
      }),
    onSuccess: (res) => {
      console.log('Login successfully: ', res);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === SystemRole.ADMIN) {
        navigate('/admin/invitations');
      } else {
        navigate('/jobs');
      }
    },
    onError: (error) => {
      console.log('Error in useMutation login', error);
      if (axios.isAxiosError(error) && error.response) {
        setEmailErrors(
          error.response.data.errors
            .filter(
              (err: { message: string }) =>
                err.message.toLowerCase().includes('email') ||
                err.message.toLowerCase().includes('user')
            )
            .map((err: { message: string }) => err.message)
        );
        setPasswordErrors(
          error.response.data.errors
            .filter((err: { message: string }) =>
              err.message.toLowerCase().includes('password')
            )
            .map((err: { message: string }) => err.message)
        );
      } else {
        toast.error('Login failed: Unexpected error occured');
      }
    },
  });

  const handleLogin = async () => {
    if (!emailInput) {
      setEmailErrors(['Email is required']);
      return;
    }
    if (!passwordInput) {
      setPasswordErrors(['Password is required']);
      return;
    }
    loginFn({ email: emailInput, password: passwordInput });
  };

  return (
    <div className="grid grid-cols-12 gap-4 max-w-screen min-h-screen px-20 py-15 bg-background dark:bg-background">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <TreverseFullLogo className="pl-3 w-[106px] h-[16px]" />
        <Card className="bg-transparent border-0 shadow-none h-full justify-center">
          <CardHeader>
            <CardTitle className="text-5xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-xl">Welcome back!</CardDescription>
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
                    placeholder="Email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailErrors([]);
                    }}
                    errors={emailErrors}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="pb-2">
                    Password
                  </Label>
                  <div className="flex flex-col justify-center relative">
                    <Input
                      id="password"
                      placeholder="Password"
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
              </div>
            </form>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="text-black w-full" onClick={handleLogin}>
              Sign in
            </Button>
            <Button variant="link" asChild>
              <Link to="/request-password-reset">Forgot your password?</Link>
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
