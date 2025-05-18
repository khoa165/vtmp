import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/base/button';

export const HeaderSorting = ({ column, headerName }) => {
  const sortingState = column.getIsSorted();
  let SortingIcon;
  if (sortingState == 'asc') {
    SortingIcon = ArrowUp;
  } else if (sortingState === 'desc') {
    SortingIcon = ArrowDown;
  } else {
    SortingIcon = ArrowUpDown;
  }

  return (
    <div className="flex items-center">
      <span>{headerName}</span>
      <Button
        variant="outline"
        className="p-0 ml-0 w-fit h-fit cursor-pointer hover:text-inherit"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <SortingIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
