import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/base/checkbox';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';
import { ApplicationActions } from '@/components/pages/application-tracker/applications/applications-action';

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
            {Object.values(ApplicationStatus).map((status, index) => (
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
        <ApplicationActions
          application={application}
          deleteApplicationFn={deleteApplicationFn}
        />
      );
    },
  },
];
