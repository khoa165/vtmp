import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FallbackComponent } from '@/components/base/fallback-component';
import { logError } from '@/utils/errors';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

// const TestErrorComponent = ({ shouldThrowError }) => {
//   if (shouldThrowError) {
//     throw new Error('This is a test error');
//   } else {
//     return null;
//   }
// };

export const ApplicationsPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});
  // const [shouldThrowError, setShouldThrowError] = useState(true);
  return (
    <div className="w-full h-full p-10">
      <ErrorBoundary
        FallbackComponent={(props) => (
          <FallbackComponent
            {...props}
            customText="Application Status Cards"
            // resetErrorBoundary={() => {
            //   props.resetErrorBoundary();
            //   setShouldThrowError(false);
            // }}
          />
        )}
        onError={logError}
      >
        <ApplicationStatusContainer
          setApplicationFilter={setApplicationFilter}
        />
        {/* <TestErrorComponent shouldThrowError={shouldThrowError} /> */}
      </ErrorBoundary>

      <ErrorBoundary
        FallbackComponent={(props) => (
          <FallbackComponent
            {...props}
            customText="Application Table"
            // resetErrorBoundary={() => {
            //   props.resetErrorBoundary();
            //   setShouldThrowError(false);
            // }}
          />
        )}
        onError={logError}
      >
        <ApplicationsContainer applicationFilter={applicationFilter} />
        {/* <TestErrorComponent shouldThrowError={shouldThrowError} /> */}
      </ErrorBoundary>
    </div>
  );
};
