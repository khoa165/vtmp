import { useMemo, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { InvitationTable } from '@/components/pages/admins/users/invitation-dashboard/invitation-table';
import { invitationsTableColumns } from '@/components/pages/admins/users/invitation-dashboard/invitations-table-columns';
import { useGetInvitations } from '@/components/pages/admins/invitations/hooks/useInvitation';
import { Skeleton } from '@/components/base/skeleton';
import { CustomError } from '@/utils/errors';

export const InvitationContainer = (): React.JSX.Element | null => {
  const { isLoading, error, data: invitations } = useGetInvitations();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => invitationsTableColumns(), []);

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
    throw new CustomError('Error fetching invitations data');
  }

  if (!invitations || invitations.length === 0) {
    return (
      <div className="flex h-[32rem] items-center justify-center">
        <p className="text-lg text-gray-500">No invitations found</p>
      </div>
    );
  }

  return (
    <InvitationTable
      columns={columns}
      data={invitations}
      sorting={sorting}
      setSorting={setSorting}
    />
  );
};
