import { Skeleton } from '@/components/base/skeleton';
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
    return (
      <div className="rounded-xl bg-background border border-background p-6 mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-3">
        <div className="flex items-center gap-4">
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
  }

  if (isError) {
    throw new Error('Error loading interviews');
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-5">
      {(Array.isArray(sharedInterviewData) ? sharedInterviewData : [])
        .sort(
          (a, b) =>
            new Date(b.interviewOnDate).getTime() -
            new Date(a.interviewOnDate).getTime()
        )
        .map((interview) => (
          <InterviewCard interview={interview} />
        ))}
    </div>
  );
};
