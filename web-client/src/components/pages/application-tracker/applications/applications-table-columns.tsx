import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Link } from 'lucide-react';

import { ApplicationStatus } from '@vtmp/common/constants';

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
    id: 'actions',
    enableHiding: false,
    size: 150, // in pixels
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="flex justify-center items-center">
          <CellActions
            application={application}
            deleteApplicationFn={deleteApplicationFn}
            handleOpenDrawer={handleOpenDrawer}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Company" />
        </div>
      );
    },
    enableResizing: true,
  },
  {
    accessorKey: 'status',
    size: 200, // in pixels
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Status" />
        </div>
      );
    },
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="pl-2">
          <CellApplicationStatus
            application={application}
            updateApplicationStatusFn={updateApplicationStatusFn}
          />
        </div>
      );
    },
    enableResizing: true,
  },
  {
    accessorKey: 'appliedOnDate',
    size: 100, // in pixels
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Date Applied" />
        </div>
      );
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('appliedOnDate');
      if (!isoDate) return <div>-</div>;
      const date = new Date(isoDate);
      return <div className="pl-2">{format(date, MONTH_DATE_YEAR)}</div>;
    },
    enableResizing: true,
  },
  {
    accessorKey: 'portalLink',
    size: 300, // in pixels
    header: () => <div className="pl-2">Portal Link</div>,
    cell: ({ row }) => {
      return (
        <a
          href={row.original.portalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center underline hover:text-primary pl-2"
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
    size: 100, // in pixels
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Interest" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="pl-2">
          <ApplicationInterestColumn interest={row.original.interest} />
        </div>
      );
    },
    enableResizing: true,
  },
  {
    accessorKey: 'referrer',
    size: 130, // in pixels
    header: () => <div className="pl-2">Referrer</div>,
    enableResizing: true,
  },
  {
    accessorKey: 'note',
    header: () => <div className="pl-2">Note</div>,
    enableResizing: true,
  },
];
