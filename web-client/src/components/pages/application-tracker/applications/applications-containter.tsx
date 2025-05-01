import { applicationColumns } from '@/components/pages/application-tracker/applications/application-columns';
import { DataTable } from '@/components/pages/application-tracker/applications/data-table';
import { useApplications } from '@/components/pages/application-tracker/applications/hooks/useApplications';

export const ApplicationsContainer = (): React.JSX.Element | null => {
  const {
    isLoading,
    isError,
    error,
    data: applicationsData,
  } = useApplications.useGetApplications();
  const { mutate: deleteApplicationFn } =
    useApplications.useDeleteApplication();
  const { mutate: updateApplicationStatusFn } =
    useApplications.useUpdateApplicationStatus();

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
