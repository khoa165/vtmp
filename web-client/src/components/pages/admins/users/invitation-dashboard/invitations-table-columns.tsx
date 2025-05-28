import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { HeaderSorting } from '@/components/pages/application-tracker/applications/header';
import { IInvitationSchema } from '@/components/pages/admins/users/invitation-dashboard/validation';
import { Button } from '@/components/base/button';
import { capitalize } from 'remeda';
import { StatusDot } from '@/components/base/status-dot';
import { InvitationStatusToColorMapping } from '@/utils/constants';

export const invitationsTableColumns = (): ColumnDef<IInvitationSchema>[] => [
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
          <HeaderSorting column={column} headerName="Status" />{' '}
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
            className="w-[170px] flex justify-center"
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
      const isoDate = row.getValue<string>('expiryDate');
      const date = new Date(isoDate);
      return (
        <div className="flex justify-center">{format(date, 'MMM d, yyyy')}</div>
      );
    },
    enableResizing: true,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <div className="flex justify-center gap-1">
          <Button justify="between" size="sm" className="bg-[#FEB584]">
            Revoke
          </Button>
          <Button justify="between" size="sm" className="bg-[#E1FFFA]">
            Resend
          </Button>
        </div>
      );
    },
  },
];
