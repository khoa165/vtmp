import { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';

import { formatEnumName } from '@vtmp/common/utils';

import { HeaderSorting } from '@/components/base/header';
import { StatusDot } from '@/components/base/status-dot';
import { ReviewPopupButton } from '@/components/pages/admins/links/review-popup-button';
import {
  ILinkResponse,
  JobPostingData,
} from '@/components/pages/admins/links/validation';
import { LinksColorMapping } from '@/utils/constants';
import { MONTH_DATE_YEAR } from '@/utils/date';

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
    cell: ({ row }) => (
      <div className="pl-2">
        {row.original.jobTitle ? row.original.jobTitle : 'N/A'}
      </div>
    ),
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
          <div className="pl-2">{format(new Date(), MONTH_DATE_YEAR)}</div>
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
