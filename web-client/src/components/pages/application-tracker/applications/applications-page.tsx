import { Button } from '@/components/base/button';
import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';
import { ErrorInfo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/base/alert';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

const FallbackUI = ({
  error,
  resetErrorBoundary,
  customText,
}: {
  error: Error;
  resetErrorBoundary: () => void;
  customText: string;
}) => {
  console.log(error.message);
  return (
    <Alert
      variant="default"
      className="flex flex-col justify-center p-4 bg-transparent border border-white rounded-md gap-4 mb-6"
    >
      <AlertTitle className="text-2xl">Something went wrong</AlertTitle>
      <AlertDescription>
        Sorry, there was an error loading {customText}. Please try again.
      </AlertDescription>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try Again
      </Button>
    </Alert>
  );
};

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
          <FallbackUI
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
          <FallbackUI
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
