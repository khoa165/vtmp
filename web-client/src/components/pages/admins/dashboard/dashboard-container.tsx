import { DashBoardTable } from '@/components/pages/admins/dashboard/dashboard-table';
import { dashboardTableColumns } from '@/components/pages/admins/dashboard/dashboard-table-columns';
import {
  useApproveDashBoardLink,
  useGetDashBoardLinks,
  useRejectDashBoardLink,
} from '@/components/pages/admins/dashboard/hooks/dashboard';
export const DashBoardContainer = () => {
  const { isLoading, isError, error, data: linksData } = useGetDashBoardLinks();
  const { mutate: approveDashBoardLinkFn } = useApproveDashBoardLink();
  const { mutate: rejectDashBoardLinkFn } = useRejectDashBoardLink();
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

  if (!linksData || linksData.length === 0) {
    // TODO-(QuangMinhNguyen27405/dsmai): Replace `return null` with an empty state message or component
    // we shouldn't just return null when mentee has no application yet
    return null;
  }
  return (
    <DashBoardTable
      columns={dashboardTableColumns({
        approveDashBoardLinkFn,
        rejectDashBoardLinkFn,
      })}
      data={linksData}
    />
  );
};
