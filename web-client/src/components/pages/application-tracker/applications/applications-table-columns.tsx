import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/base/checkbox';
import { Link } from 'lucide-react';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';
import {
  CellActions,
  CellApplicationStatus,
} from '@/components/pages/application-tracker/applications/cell';
import { format } from 'date-fns';
import { HeaderSorting } from '@/components/pages/application-tracker/applications/header';
import { ApplicationInterestColumn } from '@/components/pages/application-tracker/applications/application-interest-column';

export const applicationsTableColumns = ({
  deleteApplicationFn,
  updateApplicationStatusFn,
}: {
  deleteApplicationFn: (id: string) => void;
  updateApplicationStatusFn: ({
    applicationId,
    body,
  }: {
    applicationId: string;
    body: { updatedStatus: ApplicationStatus };
  }) => void;
}): ColumnDef<IApplication>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Company" />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Status" />;
    },
    cell: ({ row }) => {
      const application = row.original;
      return (
        <CellApplicationStatus
          application={application}
          updateApplicationStatusFn={updateApplicationStatusFn}
        />
      );
    },
  },
  {
    accessorKey: 'appliedOnDate',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Date Applied" />;
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('appliedOnDate');
      const date = new Date(isoDate);
      return <div>{format(date, 'MMM d, yyyy')}</div>;
    },
  },
  {
    accessorKey: 'portalLink',
    header: 'Portal Link',
    cell: ({ row }) => {
      return (
        <a
          href={row.original.portalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center underline hover:text-primary"
        >
          {row.original.portalLink}
          <Link className="ml-1 h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: 'interest',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Interest" />;
    },
    cell: ({ row }) => {
      return <ApplicationInterestColumn interest={row.original.interest} />;
    },
  },
  { accessorKey: 'referrer', header: 'Referrer' },
  { accessorKey: 'note', header: 'Note' },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const application = row.original;
      return (
        <CellActions
          application={application}
          deleteApplicationFn={deleteApplicationFn}
        />
      );
    },
  },
];
