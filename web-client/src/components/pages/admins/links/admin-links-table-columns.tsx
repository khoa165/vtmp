import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';

import { LinkStatus } from '@vtmp/common/constants';
import { formatEnumName } from '@vtmp/common/utils';

import { Button } from '@/components/base/button';
import { HeaderSorting } from '@/components/base/header';
import { StatusDot } from '@/components/base/status-dot';
import { ReviewPopupButton } from '@/components/pages/admins/links/review-popup-button';
import {
  ILinkResponse,
  JobPostingData,
} from '@/components/pages/admins/links/validation';
import { LinksColorMapping } from '@/utils/constants';

interface AdminLinksTableColumnsProps {
  approveLinkFn: ({
    linkId,
    newUpdate,
  }: {
    linkId: string;
    newUpdate: JobPostingData;
  }) => void;
  rejectLinkFn: ({ linkId }: { linkId: string }) => void;
  processIndividualLinkFn: ({ linkId }: { linkId: string }) => void;
}

export const adminLinksTableColumns = ({
  approveLinkFn,
  rejectLinkFn,
  processIndividualLinkFn,
}: AdminLinksTableColumnsProps): ColumnDef<ILinkResponse>[] => [
  {
    accessorKey: 'jobTitle',
    header: () => <div className="pl-2">Job Title</div>,
    cell: ({ row }) => {
      if (!row.original.jobTitle) {
        return <span className="pl-2">N/A</span>;
      }
      return (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:text-primary pl-2"
        >
          <span className="underline line-clamp-2">
            {row.original.jobTitle}
          </span>
        </a>
      );
    },
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="Company" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="pl-2">
          {row.original.companyName ? row.original.companyName : 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="pl-2">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 pl-2">
          <StatusDot
            status={row.original.status}
            colorMapping={LinksColorMapping}
          />
          {formatEnumName(row.original.status, { uppercase: true })}
        </div>
      );
    },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => (
      <div className="pl-2">
        <HeaderSorting column={column} headerName="Submitted" />
      </div>
    ),
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      if (!isoDate)
        return (
          <div className="pl-2">
            {formatDistanceToNow(new Date(), { addSuffix: true })}
          </div>
        );
      const date = new Date(isoDate);
      return (
        <div className="pl-2">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className="pl-2"></div>,
    cell: ({ row }) => {
      const canProcess =
        row.original.status === LinkStatus.PENDING_PROCESSING ||
        row.original.status === LinkStatus.PENDING_RETRY;

      return (
        <div className="pl-2 flex gap-2">
          <ReviewPopupButton
            currentLink={row.original}
            approveLinkFn={approveLinkFn}
            rejectLinkFn={rejectLinkFn}
          />
          {canProcess && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                processIndividualLinkFn({ linkId: row.original._id })
              }
              className="h-8 px-3"
            >
              Process Link
            </Button>
          )}
        </div>
      );
    },
  },
];
