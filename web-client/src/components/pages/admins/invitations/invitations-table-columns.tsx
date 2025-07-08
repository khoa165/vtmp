import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { capitalize } from 'remeda';
import { toast } from 'sonner';

import { InvitationStatus } from '@vtmp/common/constants';

import { Button } from '@/components/base/button';
import { HeaderSorting } from '@/components/base/header';
import { StatusDot } from '@/components/base/status-dot';
import { IInvitationSchema } from '@/components/pages/admins/invitations/validation';
import { InvitationStatusToColorMapping } from '@/utils/constants';
import { getClientOrigin } from '@/utils/helpers';

export const invitationsTableColumns = (
  revokeInvitation: (id: string) => void,
  sendInvitation: (data: {
    receiverName: string;
    receiverEmail: string;
    senderId: string;
    webUrl: string;
  }) => void
): ColumnDef<IInvitationSchema>[] => {
  return [
    {
      accessorKey: 'receiverName',
      header: ({ column }) => {
        return (
          <div className="flex flex-start">
            <HeaderSorting column={column} headerName="Receiver Name" />
          </div>
        );
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return <div className="flex flex-start">{invitation.receiverName}</div>;
      },
      enableResizing: true,
    },
    {
      accessorKey: 'receiverEmail',
      header: ({ column }) => {
        return (
          <div className="flex flex-start">
            <HeaderSorting column={column} headerName="Send To" />
          </div>
        );
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex flex-start">{invitation.receiverEmail}</div>
        );
      },
      enableResizing: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <div className="flex flex-start">
            <HeaderSorting column={column} headerName="Status" />
          </div>
        );
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex flex-start">
            <Button
              variant="ghost"
              justify="between"
              size="sm"
              className="w-[170px]"
            >
              <div className="flex items-center gap-2  text-center">
                <StatusDot
                  status={invitation.status}
                  colorMapping={InvitationStatusToColorMapping}
                />
                {capitalize(invitation.status)}
              </div>
            </Button>
          </div>
        );
      },
      enableResizing: true,
    },
    {
      accessorKey: 'expiryDate',
      header: ({ column }) => {
        return (
          <div className="flex flex-start">
            <HeaderSorting column={column} headerName="Expiry Date" />
          </div>
        );
      },
      cell: ({ row }) => {
        const isoDate = row.original.expiryDate;
        const date = new Date(isoDate);
        return (
          <div className="flex flex-start">{format(date, 'MMM d, yyyy')}</div>
        );
      },
      enableResizing: true,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const invitation = row.original;
        const isPending = invitation.status === InvitationStatus.PENDING;

        const handleRevoke = () => {
          if (!isPending) {
            toast.error('Can only revoke pending invitations');
            return;
          }
          revokeInvitation(invitation._id);
        };

        const handleResend = () => {
          if (!isPending) {
            toast.error('Can only resend pending invitations');
            return;
          }
          sendInvitation({
            receiverEmail: invitation.receiverEmail,
            receiverName: invitation.receiverName,
            senderId: invitation._id,
            webUrl: getClientOrigin(),
          });
        };

        return (
          <div className="flex flex-start gap-1">
            <Button
              variant="outline"
              justify="between"
              size="sm"
              className="bg-vtmp-orange"
              onClick={handleRevoke}
              disabled={!isPending}
            >
              Revoke
            </Button>
            <Button
              justify="between"
              size="sm"
              className="bg-vtmp-mint"
              onClick={handleResend}
              disabled={!isPending}
            >
              Resend
            </Button>
          </div>
        );
      },
    },
  ];
};
