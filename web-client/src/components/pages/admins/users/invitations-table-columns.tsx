import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { HeaderSorting } from '@/components/pages/application-tracker/applications/header';
import { IInvitationSchema } from '@/components/pages/admins/users/validation';

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
