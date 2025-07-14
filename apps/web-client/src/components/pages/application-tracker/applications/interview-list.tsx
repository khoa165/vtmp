import { useState } from 'react';

import { Button } from '@/components/base/button';
import { Skeleton } from '@/components/base/skeleton';
import {
  useCreateInterview,
  useGetInterviewByApplicationId,
  useUpdateInterview,
  useDeleteInterview,
  useShareInterview,
} from '@/components/pages/application-tracker/applications/hooks/applications';
import { InterviewForm } from '@/components/pages/application-tracker/applications/interview-form';

export const InterviewList = ({ applicationId }: { applicationId: string }) => {
  const {
    isLoading: isLoadingInterviews,
    error: interviewsError,
    data: interviewsData,
  } = useGetInterviewByApplicationId(applicationId);

  const { mutate: createInterviewFn } = useCreateInterview(() =>
    setShowCreateForm(false)
  );
  const { mutate: updateInterviewFn } = useUpdateInterview();
  const { mutate: shareInterviewFn } = useShareInterview();
  const { mutate: deleteInterviewFn } = useDeleteInterview();

  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoadingInterviews) {
    return (
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-28 rounded-sm" />
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
    <div className="mt-20 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Interview Timeline</h2>
        <Button
          className={
            showCreateForm
              ? 'flex items-center h-7 gap-1.5 rounded-sm border border-orange-300 px-4 text-xs text-orange-300 bg-background hover:bg-background hover:text-orange-400 hover:border-orange-400 transition'
              : 'h-7 gap-1.5 rounded-sm border border-foreground px-4 text-xs text-foreground bg-background hover:bg-background hover:text-gray-300 hover:border-gray-300 transition'
          }
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Discard Interview' : '+ Add Interview'}
        </Button>
      </div>

      <div>
        {showCreateForm && (
          <InterviewForm
            applicationId={applicationId}
            createInterviewFn={createInterviewFn}
            updateInterviewFn={updateInterviewFn}
            shareInterviewFn={shareInterviewFn}
            deleteInterviewFn={deleteInterviewFn}
          />
        )}
        {(Array.isArray(interviewsData) ? interviewsData : [])
          .sort(
            (a, b) =>
              new Date(b.interviewOnDate).getTime() -
              new Date(a.interviewOnDate).getTime()
          )
          .map((interview) => (
            <InterviewForm
              key={interview._id}
              applicationId={applicationId}
              currentInterview={interview}
              createInterviewFn={createInterviewFn}
              updateInterviewFn={updateInterviewFn}
              shareInterviewFn={shareInterviewFn}
              deleteInterviewFn={deleteInterviewFn}
            />
          ))}
      </div>
    </div>
  );
};
