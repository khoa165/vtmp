import React from 'react';

import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { InvitationContainer } from '@/components/pages/admins/users/invitation-container';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

export const UserInvitationPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});
  return (
    <div className="w-full h-full p-10">
      <ErrorBoundaryWrapper customText="Invitation Table">
        <InvitationContainer applicationFilter={applicationFilter} />
      </ErrorBoundaryWrapper>
    </div>
  );
};
