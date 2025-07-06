import React from 'react';

import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { InvitationContainer } from '@/components/pages/admins/invitations/invitation-container';
import { SendInvitation } from '@/components/pages/admins/invitations/send-invitation';

export const InvitationsPage = () => {
  return (
    <div className="w-full h-full p-10">
      <ErrorBoundaryWrapper customText="Send Invitation">
        <SendInvitation />
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper customText="Invitations Table">
        <InvitationContainer />
      </ErrorBoundaryWrapper>
    </div>
  );
};
