import axios from 'axios';
import { useMemo } from 'react';

import { LinkStatus } from '@vtmp/common/constants';

import { useLogout } from '#vtmp/web-client/hooks/useLogout';
import { Skeleton } from '@/components/base/skeleton';
import { AdminLinksTable } from '@/components/pages/admins/links/admin-links-table';
import { adminLinksTableColumns } from '@/components/pages/admins/links/admin-links-table-columns';
import {
  useApproveLink,
  useGetLinks,
  useRejectLink,
  useTriggerCron,
} from '@/components/pages/admins/links/hooks/admin-links';
import { CustomError } from '@/utils/errors';

interface AdminLinksContainerProps {
  linksFilter?: { status?: LinkStatus };
}

export const AdminLinksContainer = ({
  linksFilter,
}: AdminLinksContainerProps) => {
  const { isLoading, error, data: linksData } = useGetLinks(linksFilter);

  const { mutate: approveLinkFn } = useApproveLink();
  const { mutate: rejectLinkFn } = useRejectLink();
  const { mutate: triggerCronFn } = useTriggerCron();

  const columns = useMemo(
    () =>
      adminLinksTableColumns({
        approveLinkFn,
        rejectLinkFn,
      }),
    [linksData, approveLinkFn, rejectLinkFn, triggerCronFn]
  );
  const { logout } = useLogout();

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
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) logout();
    }
    throw new CustomError('Error fetching links data');
  }

  if (!linksData || linksData.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No links to display.</p>
    );
  }

  return (
    <AdminLinksTable
      columns={columns}
      data={linksData}
      triggerCronFn={triggerCronFn}
    />
  );
};
