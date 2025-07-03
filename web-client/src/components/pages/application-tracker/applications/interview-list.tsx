import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/base/button';
import { Skeleton } from '@/components/base/skeleton';
import {
  useCreateInterview,
  useGetInterviewByApplicationId,
  useUpdateInterview,
  useDeleteInterview,
  useShareInterview,
  useUnshareInterview,
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
  const { mutate: unshareInterviewFn } = useUnshareInterview();
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

      <div className="list-container gap-3">
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              layout
              className="relative"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  type: 'spring',
                  bounce: 0.3,
                  opacity: { delay: 0.5, duration: 0.3 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  type: 'spring',
                  duration: 0.8,
                  opacity: { duration: 0.4 },
                },
              }}
            >
              <InterviewForm
                applicationId={applicationId}
                createInterviewFn={createInterviewFn}
                updateInterviewFn={updateInterviewFn}
                shareInterviewFn={shareInterviewFn}
                unshareInterviewFn={unshareInterviewFn}
                deleteInterviewFn={deleteInterviewFn}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {(Array.isArray(interviewsData) ? interviewsData : [])
          .sort(
            (a, b) =>
              new Date(b.interviewOnDate).getTime() -
              new Date(a.interviewOnDate).getTime()
          )
          .map((interview) => (
            <InterviewForm
              applicationId={applicationId}
              key={interview._id}
              currentInterview={interview}
              createInterviewFn={createInterviewFn}
              updateInterviewFn={updateInterviewFn}
              shareInterviewFn={shareInterviewFn}
              unshareInterviewFn={unshareInterviewFn}
              deleteInterviewFn={deleteInterviewFn}
            />
          ))}
      </div>
    </div>
  );
};
