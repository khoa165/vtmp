import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/base/checkbox';
import { Button } from 'reactstrap';
import { ArrowUpDown, Link } from 'lucide-react';
import { format } from 'date-fns';
import { IJobPosting } from '@/components/pages/application-tracker/job-postings/validations';

export const jobPostingsTableColumns = (): ColumnDef<IJobPosting>[] => [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: 'ID',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'jobTitle',
    header: 'Position',
    cell: ({ row }) => {
      return (
        <a
          href={row.getValue('url')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center underline hover:text-primary"
        >
          {row.getValue('jobTitle')}
          <Link className="ml-1 h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: 'companyName',
    header: 'Company',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex items-center"
        >
          Date Posted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return (
        <div className="px-4 text-left">{format(date, 'MMM d, yyyy')}</div>
      );
    },
  },
  {
    accessorKey: 'adminNotes',
    header: 'Note',
  },
];
