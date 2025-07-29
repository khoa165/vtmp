import React from 'react';

import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { InvitationContainer } from '@/components/pages/admins/invitations/invitation-container';

export const InvitationsPage = () => {
  return (
    <div className="w-full h-full p-10">
      <div className="flex flex-col mb-4">
        <p className="text-3xl font-bold text-foreground mb-4">Invitations</p>
        <p className="text-xl text-muted-foreground">
          Invite mentors and mentees to use this app
        </p>
      </div>
      <ErrorBoundaryWrapper customText="Invitations Table">
        <InvitationContainer />
      </ErrorBoundaryWrapper>
    </div>
  );
};
