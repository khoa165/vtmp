import { ApplicationsChart } from '#vtmp/web-client/components/pages/admins/visualization/applications-chart';
import { useGetVisualizations } from '#vtmp/web-client/components/pages/admins/visualization/hooks/visualization';
import { JobPostingsChart } from '#vtmp/web-client/components/pages/admins/visualization/job-postings-chart';
import { Skeleton } from '@/components/base/skeleton';
import { CustomError } from '@/utils/errors';

export const VisualizationContainer = () => {
  const { isLoading, error, data: visualizationData } = useGetVisualizations();

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-10 w-[24rem] rounded-md" />
          <Skeleton className="h-10 w-[8rem] rounded-md" />
        </div>
        <Skeleton className="h-[32rem] w-full rounded-xl" />
      </>
    );
  }

  if (error) {
    console.log(error);
    throw new CustomError('Error fetching visualization');
  }

  if (!visualizationData) {
    return (
      <p className="text-center text-muted-foreground">
        No visualization data to display.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1">
      <ApplicationsChart data={visualizationData.APPLICATIONS_COUNT} />
      <JobPostingsChart data={visualizationData.JOB_POSTINGS_TREND} />
    </div>
  );
};
