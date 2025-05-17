import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/base/button';
import { IDashBoardLink } from '@/components/pages/admins/dashboard/validation';
import { format } from 'date-fns';
import { ReviewPopupButton } from '@/components/pages/admins/dashboard/review-popup-button';
import { StatusDot } from '@/components/base/status-dot';
import { LinkStatus } from '@vtmp/common/constants';

export const dashboardTableColumns = ({
  approveDashBoardLinkFn,
  rejectDashBoardLinkFn,
}: {
  approveDashBoardLinkFn: ({
    linkId,
    newUpdate,
  }: {
    linkId: string;
    newUpdate: Partial<IDashBoardLink>;
  }) => void;
  rejectDashBoardLinkFn: ({ linkId }: { linkId: string }) => void;
}): ColumnDef<IDashBoardLink>[] => [
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
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Button variant="outline">
          <StatusDot
            status={LinkStatus[row.original.status as keyof typeof LinkStatus]}
          />{' '}
          {row.original.status}
        </Button>
      );
    },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <span>Date Posted</span>
          <Button
            variant="outline"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
            }}
            className="w-fit h-fit cursor-pointer hover:text-inherit"
          >
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const isoDate = row.getValue<Date>('datePosted');
      const date = isoDate ? new Date(isoDate) : new Date();
      return <span>{format(date, 'MM/dd/yyyy')}</span>;
    },
  },
  {
    header: 'Review',
    cell: ({ row }) => {
      const {
        _id,
        url,
        companyName,
        jobTitle,
        location,
        datePosted,
        jobDescription,
      } = row.original;
      return (
        <ReviewPopupButton
          linkId={_id}
          url={url}
          companyName={companyName}
          jobTitle={jobTitle}
          location={location}
          datePosted={datePosted ? format(datePosted, 'MM/dd/yyyy') : ''}
          jobDescription={jobDescription}
          approveDashBoardLinkFn={approveDashBoardLinkFn}
          rejectDashBoardLinkFn={rejectDashBoardLinkFn}
        />
      );
    },
  },
];
