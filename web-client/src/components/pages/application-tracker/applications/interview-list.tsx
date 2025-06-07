import { Button } from '@/components/base/button';
import {
  useCreateInterview,
  useGetInterviewByApplicationId,
  useUpdateInterview,
} from '@/components/pages/application-tracker/applications/hooks/applications';
import {
  InterviewUpdateForm,
  InterviewCreateForm,
} from '@/components/pages/application-tracker/applications/interview-form';
import { useState } from 'react';

// const statusColors: Record<InterviewStatus, string> = {
//   UPCOMING: 'bg-blue-100 text-blue-700',
//   PASSED: 'bg-green-100 text-green-700',
//   FAILED: 'bg-red-100 text-red-700',
//   PENDING: 'bg-yellow-100 text-yellow-700',
//   WITHDRAWN: 'bg-gray-100 text-gray-700',
// };

export const InterviewList = ({ applicationId }: { applicationId: string }) => {
  const {
    isLoading: isLoadingInterviews,
    error: interviewsError,
    data: interviewsData,
  } = useGetInterviewByApplicationId(applicationId);

  const { mutate: createInterviewFn } = useCreateInterview();
  const { mutate: updateInterviewFn } = useUpdateInterview();

  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoadingInterviews) {
    return <div>Loading interviews...</div>;
  }

  if (interviewsError) {
    return <div>Error loading interviews: {interviewsError.message}</div>;
  }

  const handleCreateInterview = () => {
    console.log('Creating interview for application:', applicationId);
    setShowCreateForm(true);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Interview Timeline</h2>
        <Button
          variant="outline"
          className="text-sm"
          onClick={handleCreateInterview}
        >
          + Add Interview
        </Button>
      </div>

      <div>
        {showCreateForm && (
          <InterviewCreateForm
            applicationId={applicationId}
            createInterviewFn={createInterviewFn}
          />
        )}
        {interviewsData?.map((interview) => (
          <InterviewUpdateForm
            interviewId={interview._id}
            currentInterview={interview}
            updateInterviewFn={updateInterviewFn}
          />
        ))}
      </div>
      <div className="rounded-2xl border p-4 shadow-sm space-y-3 bg-background h-50"></div>
    </div>
  );
};
