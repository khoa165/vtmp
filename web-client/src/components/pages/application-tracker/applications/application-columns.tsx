import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/base/checkbox';
import { ArrowUpDown } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';

import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';

const applicationStatusValues = Object.values(ApplicationStatus);

export const applicationColumns = ({
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
    accessorKey: 'jobPostingId',
    header: 'Job Posting Id',
  },
  {
    accessorKey: 'companyName',
    header: 'Company',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const application = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">{application.status}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {applicationStatusValues.map((status, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  updateApplicationStatusFn({
                    applicationId: application._id,
                    body: { updatedStatus: status },
                  });
                }}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: 'appliedOnDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('appliedOnDate');
      const date = new Date(isoDate);
      return date.toISOString().split('T')[0];
    },
  },
  { accessorKey: 'portalLink', header: 'Portal Link' },
  { accessorKey: 'interest', header: 'Interest' },
  { accessorKey: 'referrer', header: 'Referrer' },
  { accessorKey: 'note', header: 'Note' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const application = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(application._id)}
            >
              Copy application ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Modified application status')}
            >
              Change application status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (
                  confirm('Are you sure you want to delete this application?')
                ) {
                  deleteApplicationFn(application._id);
                }
              }}
            >
              Delete application
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
