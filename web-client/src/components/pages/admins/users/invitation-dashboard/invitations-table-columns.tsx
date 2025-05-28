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
      return <HeaderSorting column={column} headerName="Send To" />;
    },
    enableResizing: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Status" />;
    },
    cell: ({ row }) => {
      const invitation = row.original;
      return (
        <div>
          <Button
            variant="outline"
            justify="between"
            size="sm"
            className="w-[170px] text-left"
          >
            <div className="flex items-center gap-2">
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
      return <HeaderSorting column={column} headerName="Expiry Date" />;
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('expiryDate');
      const date = new Date(isoDate);
      return <div>{format(date, 'MMM d, yyyy')}</div>;
    },
    enableResizing: true,
  },
];
