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
    header: 'Job Title',
    cell: ({ row }) => (
      <div className="ml-4">
        {row.original.jobTitle ? row.original.jobTitle : 'N/A'}
      </div>
    ),
  },
  {
    accessorKey: 'companyName',
    header: 'Company',
    cell: ({ row }) => {
      return (
        <div className="ml-4">
          {row.original.companyName ? row.original.companyName : 'N/A'}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
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
      <HeaderSorting column={column} headerName="Submitted" />
    ),
    cell: ({ row }) => {
      const isoDate = row.getValue<string>('datePosted');
      if (!isoDate) return <div>{format(new Date(), MONTH_DATE_YEAR)}</div>;
      const date = new Date(isoDate);
      return <div>{formatDistanceToNow(date, { addSuffix: true })}</div>;
    },
  },
  {
    header: 'Review',
    cell: ({ row }) => (
      <ReviewPopupButton
        currentLink={row.original}
        approveLinkFn={approveLinkFn}
        rejectLinkFn={rejectLinkFn}
      />
    ),
  },
];
