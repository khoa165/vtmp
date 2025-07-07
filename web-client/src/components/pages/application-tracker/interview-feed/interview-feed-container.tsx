import { useState } from 'react';

import { SharedInterviewFilter } from '#vtmp/web-client/components/pages/application-tracker/applications/validation';
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
      <InterviewSharedList interviewFilter={interviewFilter} />
    </div>
  );
};
