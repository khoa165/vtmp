import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Link } from 'lucide-react';

import { Checkbox } from '@/components/base/checkbox';
import { HeaderSorting } from '@/components/base/header';
import { JobPostingsAction } from '@/components/pages/application-tracker/job-postings/job-postings-action';
import { IJobPosting } from '@/components/pages/application-tracker/job-postings/validations';

export const jobPostingsTableColumns = ({
  createApplicationFn,
}: {
  createApplicationFn: (body: { jobPostingId: string }) => void;
}): ColumnDef<IJobPosting>[] => [
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
        className="ml-4 border border-background hover:bg-background"
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
    accessorKey: 'jobTitle',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Position" />;
    },
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
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => {
      return <HeaderSorting column={column} headerName="Date Posted" />;
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return <div>{format(date, 'MMM d, yyyy')}</div>;
    },
  },
  {
    accessorKey: 'adminNotes',
    header: 'Note',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const jobPosting = row.original;
      return (
        <JobPostingsAction
          jobPosting={jobPosting}
          createApplicationFn={createApplicationFn}
        />
      );
    },
  },
];
