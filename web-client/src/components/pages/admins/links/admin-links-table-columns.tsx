import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Button } from '@/components/base/button';
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
        <Button variant="outline">
          <StatusDot
            status={row.original.status}
            colorMapping={LinksColorMapping}
          />
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
      if (!isoDate) return <div>{format(new Date(), MONTH_DATE_YEAR)}</div>;
      const date = new Date(isoDate);
      return <div>{format(date, MONTH_DATE_YEAR)}</div>;
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
