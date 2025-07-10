import { useMemo } from 'react';

import { Card } from '#vtmp/web-client/components/base/card';
import { Skeleton } from '@/components/base/skeleton';
import { SharedInterviewFilter } from '@/components/pages/application-tracker/applications/validation';
import { useGetSharedInterviews } from '@/components/pages/application-tracker/interview-feed/hooks/interviews';
import { InterviewCard } from '@/components/pages/application-tracker/interview-feed/interview-card';

export const InterviewSharedList = ({
  interviewFilter,
}: {
  interviewFilter: SharedInterviewFilter;
}) => {
  const {
    isLoading: isInterviewsLoading,
    isError: isInterviewsError,
    data: sharedInterviewData,
  } = useGetSharedInterviews(interviewFilter);

  const sortedSharedInterviews = useMemo(() => {
    if (!Array.isArray(sharedInterviewData)) return [];
    return [...sharedInterviewData].sort(
      (a, b) =>
        new Date(b.interviewOnDate).getTime() -
        new Date(a.interviewOnDate).getTime()
    );
  }, [sharedInterviewData]);

  if (isInterviewsLoading) {
    return <InterviewSharedListSkeleton />;
  }

  if (isInterviewsError) {
    throw new Error('Error loading interviews.');
  }

  return (
    <>
      {sortedSharedInterviews.length > 0 ? (
        sortedSharedInterviews.map((interview) => (
          <InterviewCard interview={interview} />
        ))
      ) : (
        <Card className="rounded-xl bg-background border border-background py-6 mb-10 h-100 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col items-center justify-center my-auto text-center">
            <h3 className="text-2xl font-semibold mb-4">
              No Shared Interviews Found
            </h3>
            <p className="text-gray-500">No one shared any interviews yet.</p>
          </div>
        </Card>
      )}
    </>
  );
};

const InterviewSharedListSkeleton = () => {
  return (
    <div className=" rounded-xl bg-background border border-background p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-5">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <div>
        <Skeleton className="h-8 w-3/5 rounded" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
};
