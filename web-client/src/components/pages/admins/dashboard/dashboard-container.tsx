import { DashBoardTable } from '@/components/pages/admins/dashboard/dashboard-table';
import { dashboardTableColumns } from '@/components/pages/admins/dashboard/dashboard-table-columns';
import { useGetDashBoardLinks } from '@/components/pages/admins/dashboard/hooks/dashboard';
export const DashBoardContainer = () => {
  const { isLoading, isError, error, data: linksData } = useGetDashBoardLinks();

  if (isLoading) {
    // TODO-(QuangMinhNguyen27405/dsmai): Remove this console log in production and add a loading spinner
    console.log('Loading links data...');
    return <span>Loading links data...</span>;
  }
  if (isError) {
    // TODO-(QuangMinhNguyen27405/dsmai) : Remove this and add a toast error message. Add react-error-boundary
    console.error('Error fetching links data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load applications data.'}</span>
    // );
    return null;
  }
  console.log(linksData);
  if (!linksData || linksData.length === 0) {
    // TODO-(QuangMinhNguyen27405/dsmai): Replace `return null` with an empty state message or component
    // we shouldn't just return null when mentee has no application yet
    return null;
  }

  return <DashBoardTable columns={dashboardTableColumns()} data={linksData} />;
};
