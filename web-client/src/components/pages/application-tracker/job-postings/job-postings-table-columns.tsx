import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Link } from 'lucide-react';

import { Button } from '@/components/base/button';
import { HeaderSorting } from '@/components/base/header';
import { IJobPosting } from '@/components/pages/application-tracker/job-postings/validations';
import { MONTH_DATE_YEAR } from '@/utils/date';

export const jobPostingsTableColumns = ({
  createApplicationFn,
}: {
  createApplicationFn: (body: { jobPostingId: string }) => void;
}): ColumnDef<IJobPosting>[] => [
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
    meta: { displayName: 'Location' },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Posting date" />;
    },
    meta: { displayName: 'Posting date' },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return <div>{format(date, MONTH_DATE_YEAR)}</div>;
    },
  },
  {
    accessorKey: 'adminNotes',
    header: 'Admin notes',
    meta: { displayName: 'Admin notes' },
  },
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
];
