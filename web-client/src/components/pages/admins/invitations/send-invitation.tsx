import { Send } from 'lucide-react';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { SystemRole } from '@vtmp/common/constants';

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
import {
  IInvitationInputErrors,
  IInvitationUserInput,
  useSendInvitation,
} from '@/components/pages/admins/invitations/hooks/invitations';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getClientOrigin } from '@/utils/helpers';

export const SendInvitation = () => {
  const [userInput, setUserInput] = useState<IInvitationUserInput>({
    name: '',
    email: '',
    role: SystemRole.USER,
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
      webUrl: getClientOrigin(),
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-start-1 col-span-6 flex flex-col justify-start">
        <Card className="bg-transparent border-0  shadow-none h-full justify-center gap-0 pb-0">
          <CardHeader className="px-0">
            <CardTitle className="text-4xl font-bold">Invitations</CardTitle>
            <CardDescription className="text-2xl">
              Invite mentors and mentees to use this app
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 my-3 px-0">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid grid-cols-10 w-full items-end gap-4"
            >
              <div className="col-start-1 col-span-4 flex flex-col space-y-1.5">
                <Input
                  id="name"
                  name="name"
                  placeholder="Name"
                  type="text"
                  required
                  value={userInput.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-start-5 col-span-4 flex flex-col space-y-1.5">
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  value={userInput.email}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                className="text-black w-full col-start-9 col-span-1"
                onClick={handleSend}
              >
                <Send />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col flex-start items-start px-0 text-vtmp-orange">
            {inputErrors.name.length > 0 && <p>{inputErrors.name[0]}</p>}
            {inputErrors.email.length > 0 && <p>{inputErrors.email[0]}</p>}
          </CardFooter>
        </Card>
      </div>
      <div className="col-span-12">
        <hr className="w-full border-vtmp-dark-grey" />
      </div>
    </div>
  );
};
