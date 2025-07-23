import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Link } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

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
    size: 120, // in pixels
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
    meta: { displayName: 'Company' },
    enableResizing: true,
  },
  {
    accessorKey: 'jobTitle',
    size: 300,
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Job Title" />
        </div>
      );
    },
    meta: { displayName: 'Job Title' },
    cell: ({ row }) => {
      return (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-primary pl-2"
        >
          <Link className="h-4 w-4 flex-shrink-0" />
          <span className="underline line-clamp-2">
            {row.original.jobTitle}
          </span>
        </a>
      );
    },
  },
  {
    accessorKey: 'location',
    size: 100,
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Location" />
        </div>
      );
    },
    cell: ({ row }) => {
      const location = row.original.location;
      if (location !== 'US' && location !== 'CANADA') {
        return 'Unknown';
      }
      const countryCode = location === 'US' ? 'US' : 'CA';
      return (
        <div className="pl-2">
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
              fontSize: '1.5em',
              lineHeight: '1.5em',
            }}
          />
        </div>
      );
    },
    meta: { displayName: 'Location' },
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
    meta: { displayName: 'Status' },
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
    meta: { displayName: 'Date Applied' },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('appliedOnDate');
      if (!isoDate) return <div>-</div>;
      const date = new Date(isoDate);
      return <div className="pl-2">{format(date, MONTH_DATE_YEAR)}</div>;
    },
    enableResizing: true,
  },
  // {
  //   accessorKey: 'portalLink',
  //   size: 200, // in pixels
  //   header: () => <div className="pl-2">Portal Link</div>,
  //   meta: { displayName: 'Portal Link' },
  //   cell: ({ row }) =>
  //     row.original.portalLink ? (
  //       <a
  //         href={row.original.portalLink}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="inline-flex items-center gap-2 hover:text-primary pl-2"
  //       >
  //         <Link className="h-4 w-4 flex-shrink-0" />
  //         <span className="underline">{row.original.portalLink}</span>
  //       </a>
  //     ) : null,
  //   enableResizing: true,
  // },
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
    meta: { displayName: 'Interest' },
    cell: ({ row }) => {
      return <ApplicationInterestColumn interest={row.original.interest} />;
    },
    enableResizing: true,
  },
  {
    accessorKey: 'referrer',
    size: 130, // in pixels
    header: () => <div className="pl-2">Referrer</div>,
    meta: { displayName: 'Referrer' },
    enableResizing: true,
  },
  {
    accessorKey: 'note',
    header: () => <div className="pl-2">Note</div>,
    meta: { displayName: 'Note' },
    enableResizing: true,
  },
];
