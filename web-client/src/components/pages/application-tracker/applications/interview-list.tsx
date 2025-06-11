import { Button } from '@/components/base/button';
import { Skeleton } from '@/components/base/skeleton';
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
    return (
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (interviewsError) {
    throw new Error('Error retrieving interviews: ', interviewsError);
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Interview Timeline</h2>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => setShowCreateForm(true)}
        >
          + Add Interview
        </Button>
      </div>

      <div>
        {showCreateForm && (
          <InterviewCreateForm
            applicationId={applicationId}
            createInterviewFn={createInterviewFn}
            setShowCreateForm={setShowCreateForm}
          />
        )}
        {(Array.isArray(interviewsData) ? interviewsData : []).map(
          (interview) => (
            <InterviewUpdateForm
              key={interview._id}
              currentInterview={interview}
              updateInterviewFn={updateInterviewFn}
            />
          )
        )}
      </div>
    </div>
  );
};
