import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

import { formatEnumName } from '@vtmp/common/utils';

import { StatusDot } from '#vtmp/web-client/components/base/status-dot';
import {
  JobFunctionColorMapping,
  JobTypeColorMapping,
} from '#vtmp/web-client/utils/constants';
import { Button } from '@/components/base/button';
import { HeaderSorting } from '@/components/base/header';
import { IJobPosting } from '@/components/pages/application-tracker/job-postings/validations';

export const jobPostingsTableColumns = ({
  createApplicationFn,
}: {
  createApplicationFn: (body: { jobPostingId: string }) => void;
}): ColumnDef<IJobPosting>[] => [
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const jobPosting = row.original;
      return (
        <div className="text-center">
          <Button
            size="lg"
            onClick={() =>
              createApplicationFn({ jobPostingId: jobPosting._id })
            }
          >
            Mark as applied
          </Button>
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
  },
  {
    accessorKey: 'jobFunction',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Function" />
        </div>
      );
    },
    meta: { displayName: 'Function' },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 pl-2">
          <StatusDot
            status={row.original.jobFunction}
            colorMapping={JobFunctionColorMapping}
          />
          {formatEnumName(row.original.jobFunction)}
        </div>
      );
    },
  },
  {
    accessorKey: 'jobTitle',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Position" />
        </div>
      );
    },
    meta: { displayName: 'Position' },
    cell: ({ row }) => {
      // // TODO-(QuangMinhNguyen27405): Modify column width for better visibility
      return (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center underline hover:text-primary pl-2"
        >
          {row.original.jobTitle}
          <Link className="ml-1 h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: 'jobType',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Type" />
        </div>
      );
    },
    meta: { displayName: 'Type' },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 pl-2">
          <StatusDot
            status={row.original.jobType}
            colorMapping={JobTypeColorMapping}
          />
          {formatEnumName(row.original.jobType)}
        </div>
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
    accessorKey: 'datePosted',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Posting Date" />
        </div>
      );
    },
    meta: { displayName: 'Posting Date' },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return (
        <div className="pl-2">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    accessorKey: 'adminNotes',
    header: () => <div className="pl-2">Admin Notes</div>,
    meta: { displayName: 'Admin Notes' },
  },
];
