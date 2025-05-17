import { Button } from '@/components/base/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/base/card';
import { Input } from '@/components/base/input';
import { Label } from '@/components/base/label';
import { useState } from 'react';
import LogoMint from '@/assets/images/logo-full-mint.svg?react';
import { EyeOff, Eye, TriangleAlert } from 'lucide-react';
import { Check } from 'lucide-react';
import axios from 'axios';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { useMutation } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { AuthResponseSchema } from '@/components/pages/auth/validation';
import { Method } from '@/utils/constants';
import { cn } from '@/lib/utils';

const passwordMessage = [
  '1. Password length is in range 8-20',
  '2. At least 1 uppercase',
  '3. At least 1 lowercase',
  '4. At least 1 special character',
  '5. At least 1 number',
];

const passwordStrength = ['Weak', 'Strong'];

const isPasswordValid = (password: string) =>
  password.length >= 8 &&
  password.length <= 20 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[!@#$%^&?]/.test(password) &&
  /[0-9]/.test(password);

const SignUpPage = () => {
  const emailInput = 'Email2@viettech.com';

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [firstNameInput, setFirstNameInput] = useState<string>('');
  const [lastNameInput, setLastNameInput] = useState<string>('');
  const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false);
  const [firstNameError, setFirstNameError] = useState<string[]>([]);
  const [lastNameError, setLastNameError] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string[]>(
    []
  );
  const navigate = useNavigatePreserveQueryParams();

  const resetState = () => {
    setPasswordInput('');
    setConfirmPasswordInput('');
    setFirstNameInput('');
    setLastNameInput('');
    setFirstNameError([]);
    setLastNameError([]);
    setPasswordError([]);
    setEmailError([]);
    setConfirmPasswordError([]);
  };

  const { mutate: signUpFn } = useMutation({
    mutationFn: (body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) =>
      request({
        method: Method.POST,
        url: '/auth/signup',
        data: body,
        schema: AuthResponseSchema,
      }),
    onSuccess: (res) => {
      console.log(res);
      resetState();
      navigate('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((err: { message: string }) => {
          if (
            err.message.toLocaleLowerCase().includes('email') ||
            err.message.toLocaleLowerCase().includes('user')
          ) {
            setEmailError([err.message]);
          }

          if (err.message.toLocaleLowerCase().includes('password')) {
            setPasswordError([err.message]);
            setPasswordInput('');
            setConfirmPasswordError([]);
          }
        });
      } else {
        console.log('Unexpected error', error);
      }
    },
  });

  const handleSignup = async () => {
    if (
      !isPasswordValid(passwordInput) ||
      !firstNameInput ||
      !lastNameInput ||
      passwordInput !== confirmPasswordInput
    ) {
      setConfirmPasswordError(
        confirmPasswordInput !== passwordInput || !passwordInput
          ? ['Password does not match']
          : []
      );
      setPasswordError(!passwordInput ? ['Required'] : []);
      setFirstNameError(!firstNameInput ? ['Required'] : []);
      setLastNameError(!lastNameInput ? ['Required'] : []);
      return;
    }

    signUpFn({
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
    });
  };

  return (
    <div className="grid grid-cols-12 max-w-screen min-h-screen gap-4 px-20 py-15">
      <div className="col-start-1 col-span-6">
        <div className="magic-pattern px-15 py-15 rounded-[33px]">
          <div className="relative h-full w-xs">
            <p className="text-6xl text-black font-bold absolute bottom-0">
              For Viet Tech, By Viet Tech
            </p>
          </div>
        </div>
      </div>

      <div className="col-start-7 col-span-5 flex flex-col justify-end">
        <div className="w-full flex flex-row justify-end">
          <LogoMint className="w-80 h-32 mb-[56px]" />
        </div>

        <Card className="bg-transparent border-0 h-full justify-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              Create an Account
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-row w-full gap-2">
                  <div className="flex-1 flex-col space-y-1.5">
                    <Label htmlFor="name" className="pb-2">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      value={firstNameInput}
                      onChange={(e) => {
                        setFirstNameInput(e.target.value);
                        setFirstNameError([]);
                      }}
                      errors={firstNameError}
                    />
                  </div>
                  <div className="flex-1 flex-col space-y-1.5">
                    <Label htmlFor="name" className="pb-2">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      value={lastNameInput}
                      onChange={(e) => {
                        setLastNameInput(e.target.value);
                        setLastNameError([]);
                      }}
                      errors={lastNameError}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="pb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    value={emailInput}
                    disabled={true}
                    errors={emailError}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="pb-2">
                    Password
                  </Label>
                  <div className="flex flex-col justify-center relative space-y-1.5">
                    <Input
                      id="password"
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        const passwordStrength = isPasswordValid(
                          e.target.value
                        );
                        setIsPasswordStrong(passwordStrength);
                        setPasswordError([]);
                      }}
                      errors={passwordError}
                      className="pr-10"
                    />

                    <Button
                      variant="ghost"
                      className="absolute top-0 right-1 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      z-index={1}
                    >
                      {showPassword ? (
                        <Eye className="absolute right-2" />
                      ) : (
                        <EyeOff className="absolute right-2" />
                      )}
                    </Button>
                  </div>

                  {!passwordInput ? (
                    <></>
                  ) : (
                    <div
                      className={cn(
                        `flex flex-row gap-4 border-2 } rounded-md  p-3 mt-2`,
                        {
                          'border-vtmp-orange text-vtmp-orange':
                            !isPasswordStrong,
                          'border-vtmp-green text-vtmp-green': isPasswordStrong,
                        }
                      )}
                    >
                      {!isPasswordStrong ? (
                        <TriangleAlert size={20} strokeWidth={2} />
                      ) : (
                        <Check size={20} strokeWidth={2} />
                      )}

                      <div>
                        <div className="font-bold pb-2">
                          {passwordStrength[+isPasswordStrong]} Password
                        </div>
                        {passwordMessage.map((message) => (
                          <div className="">{message}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="pb-2">
                    Confirm Password
                  </Label>
                  <div className="flex flex-col justify-center relative space-y-1.5">
                    <Input
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPasswordInput}
                      onChange={(e) => {
                        setConfirmPasswordInput(e.target.value);
                        setConfirmPasswordError([]);
                      }}
                      errors={confirmPasswordError}
                    />
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-1 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      z-index={1}
                    >
                      {showConfirmPassword ? (
                        <Eye className="absolute right-2" />
                      ) : (
                        <EyeOff className="absolute right-2" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              variant="default"
              className="text-black w-full"
              onClick={() => {
                handleSignup();
              }}
            >
              Register
            </Button>

            <div className="flex flex-row items-center gap-1 mt-2">
              <span>Already have an account?</span>
              <Button
                onClick={() => {
                  navigate('/login');
                }}
                variant="link"
                className="font-bold p-0 h-auto"
              >
                Sign In
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
