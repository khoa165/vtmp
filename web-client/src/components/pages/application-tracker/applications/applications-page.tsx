import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';
import { ErrorInfo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Fallback } from '@/components/base/fallback';

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

const logError = (error: Error, info: ErrorInfo) => {
  console.error('Error: ', error);
  console.error('Error Info ', info);
};

export const ApplicationsPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});
  // const [shouldThrowError, setShouldThrowError] = useState(true);
  return (
    <div className="w-full h-full p-10">
      <ErrorBoundary
        FallbackComponent={(props) => (
          <Fallback
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
          <Fallback
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
