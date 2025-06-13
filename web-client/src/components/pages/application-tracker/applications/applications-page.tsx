import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

export const ApplicationsPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Applications Overview
      </h1>
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
