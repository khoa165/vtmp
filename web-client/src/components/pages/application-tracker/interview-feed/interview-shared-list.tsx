import { useGetSharedInterviews } from '@/components/pages/application-tracker/interview-feed/hooks/interviews';
import { InterviewCard } from '@/components/pages/application-tracker/interview-feed/interview-card';
import { InterviewFilter } from '@/components/pages/application-tracker/interview-feed/interview-feed-container';

export const InterviewSharedList = ({
  interviewFilter,
}: {
  interviewFilter: InterviewFilter;
}) => {
  const {
    isLoading,
    isError,
    data: sharedInterviewData,
  } = useGetSharedInterviews(interviewFilter);

  if (isLoading) {
    return <div></div>;
  }

  if (isError) {
    throw new Error('Error loading interviews');
  }

  return (
    <div>
      {(Array.isArray(sharedInterviewData) ? sharedInterviewData : []).map(
        (interview) => (
          <InterviewCard interview={interview} />
        )
      )}
    </div>
  );
};
