import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryWrapper } from '@/components/base/error-boundary-wrapper';
import { logError } from '@/utils/errors';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

export const ApplicationsPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});
  return (
    <div className="w-full h-full p-10">
      <ErrorBoundary
        FallbackComponent={(props) => (
          <ErrorBoundaryWrapper
            {...props}
            customText="Application Status Cards"
          />
        )}
        onError={logError}
      >
        <ApplicationStatusContainer
          setApplicationFilter={setApplicationFilter}
        />
      </ErrorBoundary>

      <ErrorBoundary
        FallbackComponent={(props) => (
          <ErrorBoundaryWrapper {...props} customText="Application Table" />
        )}
        onError={logError}
      >
        <ApplicationsContainer applicationFilter={applicationFilter} />
      </ErrorBoundary>
    </div>
  );
};
