import type { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@/components/base/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/dropdown-menu';

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
      <DropdownMenuTrigger style={{ userSelect: 'none' }} asChild>
        <Button variant="outline" className="text-foreground">
          Configure columns visibility <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background"
        style={{ width: '100%' }}
      >
        {columns.map((column) => {
          // Determine display name
          let displayName: string = column.id;
          if (typeof column.columnDef.header === 'string') {
            displayName = column.columnDef.header;
          } else if (
            column.columnDef.meta &&
            hasDisplayName(column.columnDef.meta)
          ) {
            displayName = column.columnDef.meta.displayName;
          }

          function hasDisplayName(
            meta: unknown
          ): meta is { displayName: string } {
            return (
              typeof meta === 'object' &&
              meta !== null &&
              'displayName' in meta &&
              typeof meta.displayName === 'string'
            );
          }

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {displayName}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
