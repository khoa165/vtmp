import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { HeaderSorting } from '@/components/base/header';
import { IInvitationSchema } from '@/components/pages/admins/users/invitation-dashboard/validation';
import { Button } from '@/components/base/button';
import { capitalize } from 'remeda';
import { StatusDot } from '@/components/base/status-dot';
import { InvitationStatusToColorMapping } from '@/utils/constants';
import { InvitationStatus } from '@vtmp/common/constants';
import {
  useRevokeInvitation,
  useSendInvitation,
} from '@/components/pages/admins/invitations/hooks/useInvitation';
import { toast } from 'sonner';

export const invitationsTableColumns = (): ColumnDef<IInvitationSchema>[] => {
  const { mutate: revokeInvitation } = useRevokeInvitation();
  const { mutate: sendInvitation } = useSendInvitation();

  return [
    {
      accessorKey: 'receiverName',
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <HeaderSorting column={column} headerName="Receiver Name" />
          </div>
        );
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex justify-center">{invitation.receiverName}</div>
        );
      },
      enableResizing: true,
    },
    {
      accessorKey: 'receiverEmail',
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <HeaderSorting column={column} headerName="Send To" />
          </div>
        );
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex justify-center">{invitation.receiverEmail}</div>
        );
      },
      enableResizing: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <div className="flex justify-center">
            <HeaderSorting column={column} headerName="Status" />
          </div>
        );
      },
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
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
          <div className="flex justify-center">
            <HeaderSorting column={column} headerName="Expiry Date" />
          </div>
        );
      },
      cell: ({ row }) => {
        const isoDate = row.original.expiryDate;
        const date = new Date(isoDate);
        return (
          <div className="flex justify-center">
            {format(date, 'MMM d, yyyy')}
          </div>
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
            isResend: true,
            invitationId: invitation._id,
          });
        };

        return (
          <div className="flex justify-center gap-1">
            <Button
              justify="between"
              size="sm"
              className="bg-(--vtmp-orange)"
              onClick={handleRevoke}
              disabled={!isPending}
            >
              Revoke
            </Button>
            <Button
              justify="between"
              size="sm"
              className="bg-[#E1FFFA]"
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
