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
import LogoMint from '../../assets/images/logo-full-mint.svg?react';
import { EyeOff, Eye, TriangleAlert } from 'lucide-react';
import { Check } from 'lucide-react';
import { api } from '@/utils/axios';
import axios from 'axios';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { useMutation } from '@tanstack/react-query';
import { AuthResponseSchema } from '@/components/authentication/validation';

const passwordMessage = [
  '1. Password length is in range 8-20',
  '2. At least 1 uppercase',
  '3. At least 1 lowercase',
  '4. At least 1 special character',
  '5. At least 1 number',
];

const passwordStrengthColor = ['--vtmp-orange', '--vtmp-green'];
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigatePreserveQueryParams();

  const signUp = async () => {
    const res = await api.post('/auth/signup', {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
    });
    console.log(res.data);
    return AuthResponseSchema.parse(res.data);
  };

  const resetState = () => {
    setPasswordInput('');
    setConfirmPasswordInput('');
    setFirstNameInput('');
    setLastNameInput('');
    setFirstNameError('');
    setLastNameError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  const { mutate: signUpFn } = useMutation({
    mutationFn: signUp,
    onSuccess: (res) => {
      console.log(res.data);
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
            setEmailError(err.message);
          }

          if (err.message.toLocaleLowerCase().includes('password')) {
            setPasswordError(err.message);
            setPasswordInput('');
            setConfirmPasswordError('');
          }
          console.log(err.message);
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
          ? 'Password does not match'
          : ''
      );
      setPasswordError(!passwordInput ? 'Required' : '');
      setFirstNameError(!firstNameInput ? 'Required' : '');
      setLastNameError(!lastNameInput ? 'Required' : '');
      return;
    }

    signUpFn();
  };

  return (
    <div className="grid grid-cols-12 gap-4 w-screen h-screen px-20 py-15">
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
                        setFirstNameError('');
                      }}
                      className={
                        firstNameError ? 'border-2 border-(--vtmp-orange)' : ''
                      }
                    />
                    {firstNameError && (
                      <p className="text-(--vtmp-orange) my-2">
                        {firstNameError}
                      </p>
                    )}
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
                        setLastNameError('');
                      }}
                      className={
                        lastNameError ? 'border-2 border-(--vtmp-orange)' : ''
                      }
                    />
                    {lastNameError && (
                      <p className="text-(--vtmp-orange) my-2">
                        {lastNameError}
                      </p>
                    )}
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
                    className={
                      emailError ? 'border-2 border-(--vtmp-orange)' : ''
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
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setIsPasswordStrong(isPasswordValid(e.target.value));
                        setPasswordError('');
                      }}
                      className={
                        passwordError ? 'border-2 border-(--vtmp-orange)' : ''
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

                  {!passwordInput ? (
                    <p className="text-(--vtmp-orange) my-2">{passwordError}</p>
                  ) : (
                    <div
                      className={`flex flex-row gap-4 border-2 border-(${passwordStrengthColor[+isPasswordStrong]}) rounded-md text-(${passwordStrengthColor[+isPasswordStrong]}) p-3 mt-2`}
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
                  <div className="flex flex-col justify-center relative">
                    <Input
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPasswordInput}
                      onChange={(e) => {
                        setConfirmPasswordInput(e.target.value);
                        setConfirmPasswordError('');
                      }}
                      className={
                        confirmPasswordError
                          ? 'border-2 border-(--vtmp-orange)'
                          : ''
                      }
                    />
                    <Button
                      variant="ghost"
                      className="absolute right-2 hover:bg-transparent dark:hover:bg-transparent"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    >
                      {showConfirmPassword ? (
                        <Eye className="absolute right-2" />
                      ) : (
                        <EyeOff className="absolute right-2" />
                      )}
                    </Button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-(--vtmp-orange) my-2">
                      {confirmPasswordError}
                    </p>
                  )}
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
              <Button variant="link" className="font-bold p-0 h-auto">
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
