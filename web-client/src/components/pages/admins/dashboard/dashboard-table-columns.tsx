import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/base/button';
import { IDashBoardLink } from '@/components/pages/admins/dashboard/validation';
import { format } from 'date-fns';
import { ReviewPopupButton } from '@/components/pages/admins/dashboard/review-popup-button';
import { StatusDot } from '@/components/base/status-dot';
import { JobPostingData } from './validation';
import { HeaderSorting } from '@/components/base/header';

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
    accessorKey: 'url',
    header: () => <div className="ml-4">URL</div>,
    cell: ({ row }) => {
      const { url } = row.original;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline cursor-pointer ml-4"
        >
          {url}
        </a>
      );
    },
  },
  {
    accessorKey: 'companyName',
    header: 'Company',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Button variant="outline">
          <StatusDot status={row.original.status} />
          <span className="ml-2">{row.original.status}</span>
        </Button>
      );
    },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => (
      <HeaderSorting column={column} headerName="Date Posted" />
    ),
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return <div>{format(date, 'MMM d, yyyy')}</div>;
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
