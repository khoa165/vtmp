import { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { Skeleton } from '@/components/base/skeleton';
import {
  useGetInvitations,
  useSendInvitation,
  useRevokeInvitation,
} from '@/components/pages/admins/invitations/hooks/invitations';
import { InvitationTable } from '@/components/pages/admins/invitations/invitation-table';
import { invitationsTableColumns } from '@/components/pages/admins/invitations/invitations-table-columns';
import { CustomError } from '@/utils/errors';

export const InvitationContainer = (): React.JSX.Element | null => {
  const { isLoading, error, data: invitations } = useGetInvitations();
  const { mutate: revokeInvitation } = useRevokeInvitation();
  const { mutate: sendInvitation } = useSendInvitation({});

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => invitationsTableColumns(revokeInvitation, sendInvitation),
    [revokeInvitation, sendInvitation]
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
    console.log('error while fetching invitations', error);
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
