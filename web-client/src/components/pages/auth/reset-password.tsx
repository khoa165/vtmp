import { useMutation } from '@tanstack/react-query';
import { EyeOff, Eye, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import LogoMint from '@/assets/images/logo-full-mint.svg?react';
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
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { cn } from '@/lib/utils';
import { request } from '@/utils/api';
import {
  MAX_PASSWORD_LENGTH,
  Method,
  MIN_PASSWORD_LENGTH,
} from '@/utils/constants';

const passwordMessage = [
  '1. Password length is in range 8-20',
  '2. At least 1 uppercase',
  '3. At least 1 lowercase',
  '4. At least 1 special character',
  '5. At least 1 number',
];

enum PasswordStrengthLabel {
  Weak = 'Weak',
  Strong = 'Strong',
}

const isPasswordValid = (password: string) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[!@#$%^&?]/.test(password) &&
  /[0-9]/.test(password);

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigatePreserveQueryParams();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string[]>(
    []
  );

  useEffect(() => {
    setIsPasswordStrong(isPasswordValid(password));
  }, [password]);

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (body: { token: string; newPassword: string }) =>
      request({
        method: Method.PATCH,
        url: '/auth/reset-password',
        data: body,
      }),
    onSuccess: () => {
      toast.success('Password has been reset successfully');
      navigate('/login');
    },
    onError: (error: any) => {
      if (error?.response?.data?.errors) {
        const passwordError = error.response.data.errors.find(
          (err: { message: string }) =>
            err.message.toLowerCase().includes('password')
        );
        if (passwordError) {
          setPasswordErrors([passwordError.message]);
        } else {
          toast.error('Failed to reset password');
        }
      } else {
        toast.error('Failed to reset password');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setPasswordErrors([]);
    setConfirmPasswordErrors([]);

    // Validation
    if (!password) {
      setPasswordErrors(['Password is required']);
      return;
    }

    if (!isPasswordValid(password)) {
      setPasswordErrors(['Password does not meet requirements']);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordErrors(['Passwords do not match']);
      return;
    }

    resetPassword({ token, newPassword: password });
  };

  return (
    <div className="grid grid-cols-12 gap-4 max-w-screen min-h-screen px-20 py-15 bg-background dark:bg-background">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <LogoMint className="w-40 h-24 pl-6" />
        <Card className="bg-transparent border-0 shadow-none h-full justify-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Reset Password</CardTitle>
            <CardDescription className="text-2xl">
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3">
            <form onSubmit={handleSubmit}>
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
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordErrors([]);
                      }}
                      errors={passwordErrors}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-1 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
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
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
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
                      type="button"
                    >
                      {showConfirmPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Password Requirements:
                  </Label>
                  <div className="space-y-1">
                    {passwordMessage.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-center space-x-2 text-sm',
                          isPasswordStrong ? 'text-green-600' : 'text-gray-500'
                        )}
                      >
                        <Check
                          className={cn(
                            'h-4 w-4',
                            isPasswordStrong
                              ? 'text-green-600'
                              : 'text-gray-400'
                          )}
                        />
                        <span>{message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="text-black w-full"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Button
              variant="link"
              className="font-bold"
              onClick={() => navigate('/login')}
              disabled={isPending}
            >
              Back to Login
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
