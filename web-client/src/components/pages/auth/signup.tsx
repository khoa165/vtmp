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
import {
  MAX_PASSWORD_LENGTH,
  Method,
  MIN_PASSWORD_LENGTH,
} from '@/utils/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { omit } from 'remeda';

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

interface SignUpUserInput {
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}
interface SignUpInputErrors {
  passwordErrors: string[];
  confirmPasswordErrors: string[];
  firstNameErrors: string[];
  lastNameErrors: string[];
}

const SignUpPage = () => {
  const emailInput = 'Email2@viettech.com';

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<SignUpUserInput>({
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [inputErrors, setInputErrors] = useState<SignUpInputErrors>({
    passwordErrors: [],
    confirmPasswordErrors: [],
    firstNameErrors: [],
    lastNameErrors: [],
  });
  const navigate = useNavigatePreserveQueryParams();

  const resetState = () => {
    setUserInput({
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
    setInputErrors({
      passwordErrors: [],
      confirmPasswordErrors: [],
      firstNameErrors: [],
      lastNameErrors: [],
    });
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
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      resetState();
      navigate('/application-tracker');
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
            setInputErrors({
              ...inputErrors,
              passwordErrors: [err.message],
              confirmPasswordErrors: [],
            });
            setUserInput({ ...userInput, password: '' });
          }
        });
      } else {
        toast.error('Signup failed: Unexpected error occured');
      }
    },
  });

  const handleSignup = async () => {
    if (
      !isPasswordValid(userInput.password) ||
      !userInput.firstName ||
      !userInput.lastName ||
      userInput.password !== userInput.confirmPassword
    ) {
      setInputErrors({
        passwordErrors: !userInput.password ? ['Required'] : [],
        confirmPasswordErrors:
          userInput.password !== userInput.confirmPassword ||
          !userInput.password
            ? ['Password does not match']
            : [],
        firstNameErrors: !userInput.firstName ? ['Required'] : [],
        lastNameErrors: !userInput.lastName ? ['Required'] : [],
      });
      return;
    }

    signUpFn({
      ...omit(userInput, ['confirmPassword']),
      email: emailInput,
    });
  };

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
    setInputErrors({
      ...inputErrors,
      [e.target.name + 'Errors']: [],
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
                      name="firstName"
                      placeholder="First Name"
                      required={true}
                      value={userInput.firstName}
                      onChange={(e) => inputOnChange(e)}
                      errors={inputErrors.firstNameErrors}
                    />
                  </div>
                  <div className="flex-1 flex-col space-y-1.5">
                    <Label htmlFor="name" className="pb-2">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      required={true}
                      value={userInput.lastName}
                      onChange={(e) => inputOnChange(e)}
                      errors={inputErrors.lastNameErrors}
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
                      name="password"
                      placeholder="Password"
                      required={true}
                      type={showPassword ? 'text' : 'password'}
                      value={userInput.password}
                      onChange={(e) => {
                        inputOnChange(e);
                        const passwordStrength = isPasswordValid(
                          e.target.value
                        );
                        setIsPasswordStrong(passwordStrength);
                      }}
                      errors={inputErrors.passwordErrors}
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

                  {!userInput.password ? (
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
                          {isPasswordStrong
                            ? PasswordStrengthLabel.Strong
                            : PasswordStrengthLabel.Weak}{' '}
                          Password
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
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required={true}
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={userInput.confirmPassword}
                      onChange={(e) => inputOnChange(e)}
                      errors={inputErrors.confirmPasswordErrors}
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
