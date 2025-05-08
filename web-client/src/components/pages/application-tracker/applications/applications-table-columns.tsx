import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/base/checkbox';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus } from '@vtmp/common/constants';
import { ApplicationsAction } from '@/components/pages/application-tracker/applications/applications-action';
import { format } from 'date-fns';
import { titleCase } from '@/utils/helpers';

import confetti from 'canvas-confetti';

const handleClick = () => {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

// TODO-(QuangMinhNguyen27405/dsmai): General => Add arrow up when sorting ascending and down when descending
// and updown if we are sorting by a different column

export const applicationsTableColumns = ({
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
      // TODO-(QuangMinhNguyen27405/dsmai): Add arrow up when sorting ascending and down when descending
      // and updown if we are sorting by a different column
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
            <Button variant="outline">
              {application.status === ApplicationStatus.OA
                ? application.status
                : titleCase(application.status)}{' '}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.values(ApplicationStatus).map((dropdownStatus, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  if (dropdownStatus === ApplicationStatus.OFFERED) {
                    handleClick();
                  }
                  updateApplicationStatusFn({
                    applicationId: application._id,
                    body: { updatedStatus: dropdownStatus },
                  });
                }}
              >
                {dropdownStatus === ApplicationStatus.OA
                  ? dropdownStatus
                  : titleCase(dropdownStatus)}
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
      // TODO-(QuangMinhNguyen27405/dsmai): Add arrow up when sorting ascending and down when descending
      // and updown if we are sorting by a different column
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
      return (
        <div className="px-4 text-left">{format(date, 'MMM d, yyyy')}</div>
      );
    },
  },
  { accessorKey: 'portalLink', header: 'Portal Link' },
  { accessorKey: 'interest', header: 'Interest' },
  { accessorKey: 'referrer', header: 'Referrer' },
  { accessorKey: 'note', header: 'Note' },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const application = row.original;
      return (
        <ApplicationsAction
          application={application}
          deleteApplicationFn={deleteApplicationFn}
        />
      );
    },
  },
];
