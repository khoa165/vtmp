import { applicationColumns } from '@/components/pages/application-tracker/applications/applications-table-columns';
import { DataTable } from '@/components/pages/application-tracker/applications/applications-table';
import {
  useGetApplications,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/components/pages/application-tracker/applications/hooks/applications';

export const ApplicationsContainer = (): React.JSX.Element | null => {
  const {
    isLoading,
    isError,
    error,
    data: applicationsData,
  } = useGetApplications();
  const { mutate: deleteApplicationFn } = useDeleteApplication();
  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();

  if (isLoading) {
    console.log('Loading summary data...');
    return <span>Loading summary data...</span>;
  }

  if (isError) {
    console.error('Error fetching summary data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load summary data.'}</span>
    // );
    return null;
  }

  if (!applicationsData || applicationsData.length === 0) {
    return null;
  }

  return (
    <div>
      <DataTable
        columns={applicationColumns({
          deleteApplicationFn,
          updateApplicationStatusFn,
        })}
        data={applicationsData}
      />
    </div>
  );
};
