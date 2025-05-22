import { DashBoardTable } from '@/components/pages/admins/dashboard/dashboard-table';
import { dashboardTableColumns } from '@/components/pages/admins/dashboard/dashboard-table-columns';
import {
  useApproveDashBoardLink,
  useGetDashBoardLinks,
  useRejectDashBoardLink,
} from '@/components/pages/admins/dashboard/hooks/dashboard';
import { Skeleton } from '@/components/base/skeleton';
import { useMemo } from 'react';
import { LinkStatus } from '@vtmp/common/constants';
import { CustomError } from '@/utils/errors';
interface DashBoardContainerProps {
  linksFilter?: { status?: LinkStatus };
}

export const DashBoardContainer = ({
  linksFilter,
}: DashBoardContainerProps) => {
  const {
    isLoading,
    error,
    data: linksData,
  } = useGetDashBoardLinks(linksFilter);

  const { mutate: approveDashBoardLinkFn } = useApproveDashBoardLink();
  const { mutate: rejectDashBoardLinkFn } = useRejectDashBoardLink();

  const columns = useMemo(
    () =>
      dashboardTableColumns({
        approveDashBoardLinkFn,
        rejectDashBoardLinkFn,
      }),
    [linksData, approveDashBoardLinkFn, rejectDashBoardLinkFn]
  );

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
    throw new CustomError('Error fetching links data');
  }

  if (!linksData || linksData.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No links to display.</p>
    );
  }

  return <DashBoardTable columns={columns} data={linksData} />;
};
