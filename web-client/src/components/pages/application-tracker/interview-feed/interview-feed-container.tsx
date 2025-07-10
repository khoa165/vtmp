import { useState } from 'react';

import { ErrorBoundaryWrapper } from '#vtmp/web-client/components/base/error-boundary';
import { SharedInterviewFilter } from '#vtmp/web-client/components/pages/application-tracker/applications/validation';
import { InterviewAccordion } from '#vtmp/web-client/components/pages/application-tracker/interview-feed/interview-accordion';
import { InterviewFilterContainer } from '@/components/pages/application-tracker/interview-feed/interview-filter-container';
import { InterviewSharedList } from '@/components/pages/application-tracker/interview-feed/interview-shared-list';

export const InterviewFeedContainer = () => {
  const [interviewFilter, setInterviewFilter] = useState<SharedInterviewFilter>(
    {}
  );
  return (
    <div>
      <InterviewFilterContainer
        interviewFilter={interviewFilter}
        setInterviewFilter={setInterviewFilter}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-10">
        <div className="col-span-1 md:col-span-2">
          <ErrorBoundaryWrapper customText="Interview Feed">
            <InterviewSharedList interviewFilter={interviewFilter} />
          </ErrorBoundaryWrapper>
        </div>
        <InterviewAccordion interviewFilter={interviewFilter} />
      </div>
    </div>
  );
};
