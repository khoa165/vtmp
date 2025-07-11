import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

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
      return <HeaderSorting column={column} headerName="Company" />;
    },
    meta: { displayName: 'Company' },
  },
  {
    accessorKey: 'jobTitle',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Position" />;
    },
    meta: { displayName: 'Position' },
    cell: ({ row }) => {
      // // TODO-(QuangMinhNguyen27405): Modify column width for better visibility
      return (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center underline hover:text-primary"
        >
          {row.original.jobTitle}
          <Link className="ml-1 h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Location" />;
    },
    cell: ({ row }) => {
      const location = row.original.location;
      if (location !== 'US' && location !== 'CANADA') {
        return 'Unknown';
      }
      const countryCode = location === 'US' ? 'US' : 'CA';
      return (
        <ReactCountryFlag
          countryCode={countryCode}
          svg
          style={{
            fontSize: '1.5em',
            lineHeight: '1.5em',
          }}
        />
      );
    },
    meta: { displayName: 'Location' },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Posting Date" />;
    },
    meta: { displayName: 'Posting Date' },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>;
    },
  },
  {
    accessorKey: 'adminNotes',
    header: 'Admin Notes',
    meta: { displayName: 'Admin Notes' },
  },
];
