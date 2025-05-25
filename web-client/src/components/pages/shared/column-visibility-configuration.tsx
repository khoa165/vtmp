import { useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';
import { Button } from '@/components/base/button';
import { ChevronDown } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

interface ColumnVisibilityConfigurationProps<TData> {
  table: Table<TData>;
}

export function ColumnVisibilityConfiguration<TData>({
  table,
}: ColumnVisibilityConfigurationProps<TData>) {
  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanHide()),
    [table]
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          className="ml-auto text-foreground hover:text-background hover:bg-foreground"
        >
          Configure columns visibility <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
