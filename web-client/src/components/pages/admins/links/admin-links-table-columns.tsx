import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/base/button';
import { ILinkResponse } from '@/components/pages/admins/links/validation';
import { format } from 'date-fns';
import { ReviewPopupButton } from '@/components/pages/admins/links/review-popup-button';
import { StatusDot } from '@/components/base/status-dot';
import { JobPostingData } from './validation';
import { HeaderSorting } from '@/components/base/header';
import { StatusToColorMapping } from '@/utils/constants';
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
    header: () => <div className="ml-4">Job Title</div>,
    cell: ({ row }) => <div className="ml-4">{row.original.jobTitle}</div>,
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
          <StatusDot
            status={row.original.status}
            colorMapping={StatusToColorMapping}
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
      if (!isoDate) return <div>-</div>;
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
