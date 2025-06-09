import { useState } from 'react';

import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

export const ApplicationsPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});
  return (
    <div className="w-full h-full p-10">
      <ErrorBoundaryWrapper customText="Application Status Cards">
        <ApplicationStatusContainer
          setApplicationFilter={setApplicationFilter}
        />
      </ErrorBoundaryWrapper>

      <ErrorBoundaryWrapper customText="Application Table">
        <ApplicationsContainer applicationFilter={applicationFilter} />
      </ErrorBoundaryWrapper>
    </div>
  );
};
