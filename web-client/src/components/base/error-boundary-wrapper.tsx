import { Alert, AlertDescription, AlertTitle } from '@/components/base/alert';
import { Button } from '@/components/base/button';

export const ErrorBoundaryWrapper = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  resetErrorBoundary,
  customText,
}: {
  error: Error;
  resetErrorBoundary: () => void;
  customText: string;
}) => {
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
