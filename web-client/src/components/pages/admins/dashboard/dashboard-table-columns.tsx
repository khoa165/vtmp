import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/base/button';
import { IDashBoardLink } from '@/components/pages/admins/dashboard/validation';
import { format } from 'date-fns';
import { ReviewPopupButton } from '@/components/pages/admins/dashboard/review-popup';

export const dashboardTableColumns = (): ColumnDef<IDashBoardLink>[] => [
  {
    accessorKey: 'url',
    header: 'URL',
  },

  {
    accessorKey: 'companyName',
    header: 'Company Name',
  },
  {
    header: 'Status',
    cell: ({ row }) => {
      const link = row.original;
      return <Button variant="outline">{link.status}</Button>;
    },
  },
  {
    accessorKey: 'datePosted',
    header: ({ column }) => {
      // TODO-(QuangMinhNguyen27405/dsmai): Add arrow up when sorting ascending and down when descending
      // and updown if we are sorting by a different column
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
      const isoDate = row.getValue<string>('datePosted');
      const date = new Date(isoDate);
      return <span>{format(date, 'MM/dd/yyyy')}</span>;
    },
  },
  {
    header: 'Review',
    cell: () => <ReviewPopupButton />,
  },
];
