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
      <DropdownMenuTrigger style={{ userSelect: 'none' }}>
        <Button
          variant="outline"
          className="text-foreground"
          data-testid="column-config-button"
        >
          Configure columns visibility <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background"
        style={{ width: '100%' }}
      >
        {columns.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              data-testid={`row-config-${column.id}`}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
