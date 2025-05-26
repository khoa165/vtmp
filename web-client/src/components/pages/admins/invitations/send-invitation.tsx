import React, { useState } from 'react';
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
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Method } from '@/utils/constants';
import { request } from '@/utils/api';
import { SendInvitationResponseSchema } from '@/components/pages/admins/invitations/validation';
import { UserRole } from '@vtmp/common/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { set } from 'lodash';

export const SendInvitationPage = () => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState(UserRole.USER);
  const [nameErrors, setNameErrors] = useState<string[]>([]);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [sendInvitationErrors, setSendInvitationErrors] = useState([]);

  const { mutate: sendInvitationFn } = useMutation({
    mutationFn: (body: {
      receiverName: string;
      receiverEmail: string;
      senderId: string;
      role?: UserRole;
    }) =>
      request({
        method: Method.POST,
        url: '/invitations',
        data: body,
        schema: SendInvitationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      console.log('Success in useMutation sendInvitation');
      toast.success('Invitation sent successfully!');
      setSendInvitationErrors([]);
      setEmailErrors([]);
      setNameErrors([]);
      setNameInput('');
      setEmailInput('');
      setRoleInput(UserRole.USER);
    },
    onError: (error) => {
      console.log('error', error);
      console.log('Error in useMutation sendInvitation');
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (e: { message: string }) => e.message
        );
        const { emailRelatedErrors, otherErrors } = errorMessages.reduce(
          (
            acc: { emailRelatedErrors: string[]; otherErrors: string[] },
            errMsg: string
          ) => {
            if (
              errMsg.toLowerCase().includes('email') ||
              errMsg.toLowerCase().includes('user')
            ) {
              acc.emailRelatedErrors.push(errMsg);
            } else {
              acc.otherErrors.push(errMsg);
            }
            return acc;
          },
          { emailRelatedErrors: [], otherErrors: [] }
        );
        setEmailErrors(emailRelatedErrors);
        setSendInvitationErrors(otherErrors);
        console.log('Email errors', emailRelatedErrors);
        console.log('Other errors', otherErrors);
      } else {
        console.log('Unexpected error', error);
        toast.error('Sending invitation failed: Unexpected error occured');
      }
    },
  });

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleSend = async () => {
    if (!nameInput) {
      setNameErrors(['Receiver name is required']);
      return;
    }
    if (!emailInput) {
      setEmailErrors(['Password is required']);
      return;
    }
    sendInvitationFn({
      receiverName: nameInput,
      receiverEmail: emailInput,
      senderId: user._id,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-20 py-15">
      <div className="col-start-1 col-span-5 flex flex-col justify-start">
        <Card className="bg-transparent border-0 shadow-none h-full justify-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              Send an invitation
            </CardTitle>
            <CardDescription className="text-2xl">
              Invite mentors and mentees to use this app
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className="pb-2">
                    Receiver Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setNameErrors([]);
                    }}
                    errors={nameErrors}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="pb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailErrors([]);
                    }}
                    errors={emailErrors}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="role" className="pb-2">
                    Role
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="outline"
                        justify="between"
                        size="sm"
                        className="w-full text-left"
                      >
                        <div>{roleInput ?? UserRole.USER}</div>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {Object.values(UserRole).map((dropdownRole, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => {
                            setRoleInput(dropdownRole);
                          }}
                        >
                          {dropdownRole}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="text-black w-full" onClick={handleSend}>
              Send Invitation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
