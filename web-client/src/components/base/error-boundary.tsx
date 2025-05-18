import { Alert, AlertDescription, AlertTitle } from '@/components/base/alert';
import { Button } from '@/components/base/button';
import { ErrorBoundary } from 'react-error-boundary';
import { handleError } from '@/utils/errors';

export const ErrorBoundaryWrapper = ({
  customText,
  children,
}: {
  customText: string;
  children: React.ReactNode;
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorBoundaryFallback {...props} customText={customText} />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

const ErrorBoundaryFallback = ({
  resetErrorBoundary,
  customText,
}: {
  resetErrorBoundary: () => void;
  customText: string;
}) => (
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
