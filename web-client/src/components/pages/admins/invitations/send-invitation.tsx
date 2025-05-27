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
import { useSendInvitation } from '@/components/pages/admins/invitations/hooks/invitations';

export const SendInvitationPage = () => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState(UserRole.USER);
  const [nameErrors, setNameErrors] = useState<string[]>([]);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [sendInvitationErrors, setSendInvitationErrors] = useState<string[]>(
    []
  );

  const { mutate: sendInvitationFn } = useSendInvitation({
    setSendInvitationErrors,
    setEmailErrors,
    setNameErrors,
    setNameInput,
    setEmailInput,
    setRoleInput,
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
                    Receiver Email
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
                    <DropdownMenuContent
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      {Object.values(UserRole).map((dropdownRole, index) => (
                        <DropdownMenuCheckboxItem
                          key={index}
                          onClick={() => {
                            setRoleInput(dropdownRole);
                          }}
                          checked={roleInput === dropdownRole}
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
