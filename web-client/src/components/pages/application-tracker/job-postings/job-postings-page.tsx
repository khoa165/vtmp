import { Navigate } from 'react-router-dom';

import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { JobPostingsContainer } from '@/components/pages/application-tracker/job-postings/job-postings-container';
import { JobPostingStatusCards } from '@/components/pages/application-tracker/job-postings/job-postings-status';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const JobPostingsPage = () => {
  const user = useCurrentUser();
  if (!user) {
    return <Navigate to="/login?redirected=true" />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-foreground">
        Welcome back, {`${user.firstName} ${user.lastName}`}.
      </h1>
      <ErrorBoundaryWrapper customText="Job Postings Status Cards">
        <JobPostingStatusCards />
      </ErrorBoundaryWrapper>

      <ErrorBoundaryWrapper customText="Job Postings Table">
        <JobPostingsContainer />
      </ErrorBoundaryWrapper>
    </div>
  );
};
