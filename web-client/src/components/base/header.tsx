import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

import { Button } from '#vtmp/web-client/components/base/button';

type SortingState = 'asc' | 'desc';
type ArrowIcon = typeof ArrowUp | typeof ArrowDown;

const SortingStateToIconMapping: Record<SortingState, ArrowIcon> = {
  asc: ArrowUp,
  desc: ArrowDown,
};

export const HeaderSorting = ({ column, headerName }) => {
  const sortingState = column.getIsSorted();
  const SortingIcon =
    sortingState && SortingStateToIconMapping[sortingState]
      ? SortingStateToIconMapping[sortingState]
      : ArrowUpDown;

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
