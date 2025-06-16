import { InterviewStatus, InterviewType } from '@vtmp/common/constants';
import { useState } from 'react';
import { InterviewFilterContainer } from '@/components/pages/application-tracker/interview-feed/interview-filter-container';
import { InterviewSharedList } from '@/components/pages/application-tracker/interview-feed/interview-shared-list';

export interface InterviewFilter {
  status?: InterviewStatus;
  types?: InterviewType;
  interviewOnDate?: Date;
  companyName?: string;
}

export const InterviewFeedContainer = () => {
  const [interviewFilter, setInterviewFilter] = useState<InterviewFilter>({});
  return (
    <div>
      <InterviewFilterContainer setInterviewFilter={setInterviewFilter} />
      <InterviewSharedList interviewFilter={interviewFilter} />
    </div>
  );
};
