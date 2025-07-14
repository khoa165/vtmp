import { Send } from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { getClientOrigin } from '#vtmp/web-client/utils/helpers';
import { Button } from '@/components/base/button';
import { Input } from '@/components/base/input';
import {
  useSendInvitation,
  IInvitationUserInput,
} from '@/components/pages/admins/invitations/hooks/invitations';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const SendInvitation = () => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }

  const [userInput, setUserInput] = useState<IInvitationUserInput>({
    name: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const { mutate: sendInvitationFn } = useSendInvitation({
    setUserInput,
  });

  const handleSend = async () => {
    if (!userInput.name) {
      toast.error('Receiver name is required');
      return;
    }
    if (!userInput.email) {
      toast.error('Email is required');
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
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-20 w-full items-end gap-2 text-white"
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
      <div className="col-start-5 col-span-6 flex flex-col space-y-1.5">
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
        className="text-black w-full col-start-11 col-span-1"
        onClick={handleSend}
      >
        <Send />
      </Button>
    </form>
  );
};
