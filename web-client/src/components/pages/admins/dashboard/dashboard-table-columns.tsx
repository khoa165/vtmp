import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/base/button';
import { IDashBoardLink } from '@/components/pages/admins/dashboard/validation';
import { format } from 'date-fns';
import { ReviewPopupButton } from '@/components/pages/admins/dashboard/review-popup-button';
import { StatusDot } from '@/components/base/status-dot';
import { LinkStatus } from '@vtmp/common/constants';
import { JobPostingData } from './validation';

interface DashboardTableColumnsProps {
  approveDashBoardLinkFn: ({
    linkId,
    newUpdate,
  }: {
    linkId: string;
    newUpdate: JobPostingData;
  }) => void;
  rejectDashBoardLinkFn: ({ linkId }: { linkId: string }) => void;
}

export const dashboardTableColumns = ({
  approveDashBoardLinkFn,
  rejectDashBoardLinkFn,
}: DashboardTableColumnsProps): ColumnDef<IDashBoardLink>[] => [
  {
    header: 'URL',
    cell: ({ row }) => {
      const { url } = row.original;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline cursor-pointer"
        >
          {url}
        </a>
      );
    },
  },
  {
    accessorKey: 'companyName',
    header: 'Company Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Button variant="outline">
          <StatusDot status={LinkStatus[status as keyof typeof LinkStatus]} />
          <span className="ml-2">{status}</span>
        </Button>
      );
    },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => (
      <div className="flex items-center">
        <span>Date Posted</span>
        <Button
          variant="outline"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-fit h-fit cursor-pointer hover:text-inherit"
        >
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue<Date>('datePosted');
      const formatted = rawDate ? format(new Date(rawDate), 'MM/dd/yyyy') : '-';
      return <span>{formatted}</span>;
    },
  },
  {
    header: 'Review',
    cell: ({ row }) => (
      <ReviewPopupButton
        currentLink={row.original}
        approveDashBoardLinkFn={approveDashBoardLinkFn}
        rejectDashBoardLinkFn={rejectDashBoardLinkFn}
      />
    ),
  },
];
