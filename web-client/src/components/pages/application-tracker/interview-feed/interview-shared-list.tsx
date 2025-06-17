import { useGetSharedInterviews } from '@/components/pages/application-tracker/interview-feed/hooks/interviews';
import { InterviewCard } from '@/components/pages/application-tracker/interview-feed/interview-card';
import { InterviewFilter } from '@/components/pages/application-tracker/interview-feed/interview-feed-container';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

export const InterviewSharedList = ({
  interviewFilter,
}: {
  interviewFilter: InterviewFilter;
}) => {
  const {
    // isLoading,
    // isError,
    data: sharedInterviewData,
  } = useGetSharedInterviews(interviewFilter);

  const mockInterview = {
    username: 'Anonymous',
    status: InterviewStatus.PASSED,
    types: [InterviewType.CODE_REVIEW, InterviewType.CRITICAL_THINKING],
    interviewOnDate: new Date(),
    note: 'This is an mock interview',
  };

  // if (isLoading) {
  //   return <div></div>;
  // }

  // if (isError) {
  //   throw new Error('Error loading interviews');
  // }

  return (
    <div>
      <InterviewCard interview={mockInterview} />
      {(Array.isArray(sharedInterviewData) ? sharedInterviewData : []).map(
        (interview) => (
          <InterviewCard interview={interview} />
        )
      )}
    </div>
  );
};
