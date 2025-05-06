import { applicationsTableColumns } from '@/components/pages/application-tracker/applications/applications-table-columns';
import { ApplicationsTable } from '@/components/pages/application-tracker/applications/applications-table';
import {
  useGetApplications,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/components/pages/application-tracker/applications/hooks/applications';

export const ApplicationsContainer = ({ filter }): React.JSX.Element | null => {
  console.log('Filter prop to ApplicationsContainer: ', filter);
  const {
    isLoading,
    isError,
    error,
    data: applicationsData,
  } = useGetApplications(filter);
  const { mutate: deleteApplicationFn } = useDeleteApplication();
  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();

  if (isLoading) {
    // TODO-(QuangMinhNguyen27405/dsmai): Remove this console log in production and add a loading spinner
    console.log('Loading applications data...');
    return <span>Loading applications data...</span>;
  }

  if (isError) {
    // TODO-(QuangMinhNguyen27405/dsmai) : Remove this and add a toast error message. Add react-error-boundary
    console.error('Error fetching applications data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load applications data.'}</span>
    // );
    return null;
  }

  if (!applicationsData || applicationsData.length === 0) {
    // TODO-(QuangMinhNguyen27405/dsmai): Replace `return null` with an empty state message or component
    // we shouldn't just return null when mentee has no application yet
    return null;
  }

  return (
    <ApplicationsTable
      columns={applicationsTableColumns({
        deleteApplicationFn,
        updateApplicationStatusFn,
      })}
      data={applicationsData}
    />
  );
};
