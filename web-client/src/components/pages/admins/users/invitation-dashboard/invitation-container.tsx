import { useMemo, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { InvitationTable } from '@/components/pages/admins/users/invitation-dashboard/invitation-table';
import { invitationsTableColumns } from '@/components/pages/admins/users/invitation-dashboard/invitations-table-columns';
import { InvitationStatus } from '@vtmp/common/constants';

export const InvitationContainer = (): React.JSX.Element | null => {
  // TODO: Nam works on the API
  //   const {
  //     isLoading,
  //     error,
  //     data: applicationsData,
  //   } = useGetApplications(applicationFilter);
  //   const { mutate: deleteApplicationFn } = useDeleteApplication();
  //   const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => invitationsTableColumns(), []);

  //   if (isLoading) {
  //     return (
  //       <>
  //         <div className="flex items-center justify-between py-4">
  //           <Skeleton className="h-10 w-[24rem] rounded-md" />
  //           <Skeleton className="h-10 w-[8rem] rounded-md" />
  //         </div>
  //         <Skeleton className="h-[32rem] w-full rounded-xl" />
  //       </>
  //     );
  //   }

  //   if (error) {
  //     throw new CustomError('Error fetching applications data');
  //   }

  //   if (!applicationsData || applicationsData.length === 0) {
  //     // TODO-(QuangMinhNguyen27405/dsmai): Replace `return null` with an empty state message or component
  //     // we shouldn't just return null when mentee has no application yet
  //     return (
  //       <InvitationTable
  //         columns={columns}
  //         data={applicationsData}
  //         sorting={sorting}
  //         setSorting={setSorting}
  //       />
  //     );
  //   }

  return (
    <InvitationTable
      columns={columns}
      data={[
        {
          receiverEmail: 'nam@viettech.com',
          status: InvitationStatus.PENDING,
          expiryDate: '2025-04-26',
        },
        {
          receiverEmail: 'kha@viettech.com',
          status: InvitationStatus.ACCEPTED,
          expiryDate: '2025-05-26',
        },
        {
          receiverEmail: 'son@viettech.com',
          status: InvitationStatus.EXPIRED,
          expiryDate: '2025-03-26',
        },
        {
          receiverEmail: 'khoa@viettech.com',
          status: InvitationStatus.REVOKED,
          expiryDate: '2025-12-26',
        },
      ]}
      sorting={sorting}
      setSorting={setSorting}
    />
  );
};
