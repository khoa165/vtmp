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
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {headerName}
      <SortingIcon className="ml-2 h-4 w-4" />
    </Button>
  );
};
