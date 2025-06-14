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
import { UserRole } from '@vtmp/common/constants';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import {
  IInvitationInputErrors,
  IInvitationUserInput,
  useSendInvitation,
} from '@/components/pages/admins/invitations/hooks/invitations';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const SendInvitationPage = () => {
  const [userInput, setUserInput] = useState<IInvitationUserInput>({
    name: '',
    email: '',
    role: UserRole.USER,
  });

  const [inputErrors, setInputErrors] = useState<IInvitationInputErrors>({
    name: [],
    email: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
    setInputErrors({ ...inputErrors, [e.target.name]: [] });
  };

  const { mutate: sendInvitationFn } = useSendInvitation({
    setUserInput,
    setInputErrors,
  });

  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }

  const handleSend = async () => {
    if (!userInput.name) {
      setInputErrors({ ...inputErrors, name: ['Receiver name is required'] });
      return;
    }
    if (!userInput.email) {
      setInputErrors({ ...inputErrors, email: ['Email is required'] });
      return;
    }
    sendInvitationFn({
      receiverName: userInput.name,
      receiverEmail: userInput.email,
      senderId: user._id,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-20 py-15">
      <div className="col-start-1 col-span-6 flex flex-col justify-start">
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
                    name="name"
                    placeholder="Name"
                    type="text"
                    required
                    value={userInput.name}
                    onChange={handleInputChange}
                    errors={inputErrors.name}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="pb-2">
                    Receiver Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                    value={userInput.email}
                    onChange={handleInputChange}
                    errors={inputErrors.email}
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
                        <div>{userInput.role}</div>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      {Object.values(UserRole).map((dropdownRole, index) => (
                        <DropdownMenuCheckboxItem
                          key={index}
                          onClick={() => {
                            setUserInput({ ...userInput, role: dropdownRole });
                          }}
                          checked={userInput.role === dropdownRole}
                        >
                          {dropdownRole}
                        </DropdownMenuCheckboxItem>
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
