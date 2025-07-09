import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';
import { InterviewFeedContainer } from '@/components/pages/application-tracker/interview-feed/interview-feed-container';

export const InterviewFeedPage = () => {
  return (
    <div className="container-fluid p-10">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Interview Feed
      </h1>
      <h2 className="text-xl pt-1 font-semibold text-foreground mb-4">
        Interview insights, for Viet Tech, by Viet Tech
      </h2>
      <ErrorBoundaryWrapper customText="Application Table">
        <InterviewFeedContainer />
      </ErrorBoundaryWrapper>
    </div>
  );
};
