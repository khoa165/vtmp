import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';

import { formatEnumName } from '@vtmp/common/utils';

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
}

export const adminLinksTableColumns = ({
  approveLinkFn,
  rejectLinkFn,
}: AdminLinksTableColumnsProps): ColumnDef<ILinkResponse>[] => [
  {
    accessorKey: 'jobTitle',
    header: () => <div className="pl-2">Job Title</div>,
    cell: ({ row }) => {
      if (!row.original.jobTitle) {
        return <span className="pl-2">N/A</span>;
      }
      return row.original.aiScore >= 50 ? (
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
      ) : (
        <div className="inline-flex items-center hover:text-primary pl-2">
          <span className="line-clamp-2">{row.original.jobTitle}</span>
        </div>
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
    accessorKey: 'aiScore',
    header: ({ column }) => {
      return (
        <div className="pl-2">
          <HeaderSorting column={column} headerName="isJobPosting" />
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="pl-2">{row.original.aiScore}%</div>;
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
    id: 'review',
    header: () => <div className="pl-2">Review</div>,
    cell: ({ row }) => (
      <ReviewPopupButton
        currentLink={row.original}
        approveLinkFn={approveLinkFn}
        rejectLinkFn={rejectLinkFn}
      />
    ),
  },
];
