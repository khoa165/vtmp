import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/base/button';

const sortingIconMap = {
  asc: ArrowUp,
  desc: ArrowDown,
};

export const HeaderSorting = ({ column, headerName }) => {
  const sortingState = column.getIsSorted();
  const SortingIcon =
    sortingState && sortingIconMap[sortingState]
      ? sortingIconMap[sortingState]
      : ArrowUpDown;

  return (
    <div className="flex items-center">
      <span>{headerName}</span>
      <Button
        variant="ghost"
        className="p-0 ml-0 w-fit"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <SortingIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
