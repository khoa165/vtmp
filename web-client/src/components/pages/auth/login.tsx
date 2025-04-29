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
import React, { useState } from 'react';
import LogoMint from '@/assets/images/logo-full-mint.svg?react';
import { EyeOff, Eye } from 'lucide-react';
import { api } from '@/utils/axios';
import axios from 'axios';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigatePreserveQueryParams();

  const handleLogin = async () => {
    if (!emailInput || !passwordInput) {
      if (!emailInput) {
        setEmailError('Email is required');
      }
      if (!passwordInput) {
        setPasswordError('Password is required');
      }
      return;
    }

    setEmailError('');
    setPasswordError('');
    try {
      const res = await api.post('/auth/login', {
        email: emailInput,
        password: passwordInput,
      });
      console.log('Login response:', res.data);
      navigate('/home');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((err: { message: string }) => {
          if (
            err.message.toLocaleLowerCase().includes('email') ||
            err.message.toLocaleLowerCase().includes('user')
          ) {
            setEmailError(err.message);
          } else if (err.message.includes('password')) {
            setPasswordError(err.message);
          }
        });
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 w-screen h-screen px-20 py-15">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <LogoMint className="w-80 h-32 mb-[56px] pl-6" />
        <Card className="bg-transparent border-0 h-full justify-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-2xl">
              Welcome back!
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
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailError('');
                    }}
                    className={
                      emailError ? 'border-(--vtmp-orange) border-2' : ''
                    }
                  />
                  {emailError && (
                    <p className="text-(--vtmp-orange) my-2">{emailError}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="pb-2">
                    Password
                  </Label>
                  <div className="flex flex-col justify-center relative">
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError('');
                      }}
                      className={
                        passwordError ? 'border-(--vtmp-orange) border-2' : ''
                      }
                    />
                    <Button
                      variant="ghost"
                      className="absolute right-2 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="absolute right-2" />
                      ) : (
                        <EyeOff className="absolute right-2" />
                      )}
                    </Button>
                  </div>
                  {passwordError && (
                    <p className="text-(--vtmp-orange) my-2">{passwordError}</p>
                  )}
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
            <Button variant="link" className="font-bold">
              Forgot your password?
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

export default LoginPage;
