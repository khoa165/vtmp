import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Link } from 'lucide-react';

import { ApplicationStatus } from '@vtmp/common/constants';

import { Checkbox } from '@/components/base/checkbox';
import { HeaderSorting } from '@/components/base/header';
import { ApplicationInterestColumn } from '@/components/pages/application-tracker/applications/application-interest-column';
import {
  CellActions,
  CellApplicationStatus,
} from '@/components/pages/application-tracker/applications/cell';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { MONTH_DATE_YEAR } from '@/utils/date';

export const applicationsTableColumns = ({
  deleteApplicationFn,
  updateApplicationStatusFn,
  handleOpenDrawer,
}: {
  deleteApplicationFn: (id: string) => void;
  updateApplicationStatusFn: ({
    applicationId,
    body,
  }: {
    applicationId: string;
    body: { updatedStatus: ApplicationStatus };
  }) => void;
  handleOpenDrawer: (id: string) => void;
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
    enableResizing: false,
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Company" />;
    },
    enableResizing: true,
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
    enableResizing: true,
  },
  {
    accessorKey: 'appliedOnDate',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Date Applied" />;
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('appliedOnDate');
      if (!isoDate) return <div>-</div>;
      const date = new Date(isoDate);
      return <div>{format(date, MONTH_DATE_YEAR)}</div>;
    },
    enableResizing: true,
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
    enableResizing: true,
  },
  {
    accessorKey: 'interest',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Interest" />;
    },
    cell: ({ row }) => {
      return <ApplicationInterestColumn interest={row.original.interest} />;
    },
    enableResizing: true,
  },
  { accessorKey: 'referrer', header: 'Referrer', enableResizing: true },
  { accessorKey: 'note', header: 'Note', enableResizing: true },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const application = row.original;
      return (
        <CellActions
          application={application}
          deleteApplicationFn={deleteApplicationFn}
          handleOpenDrawer={handleOpenDrawer}
        />
      );
    },
  },
];
