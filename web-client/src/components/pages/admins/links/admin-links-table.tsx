import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/base/button';
import { Input } from '@/components/base/input';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';
import { ResizableTable } from '@/components/pages/shared/resizable-table';

interface AdminLinksTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  triggerCronFn: () => void;
}

export function AdminLinksTable<TData, TValue>({
  columns,
  data,
  triggerCronFn,
}: AdminLinksTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'datePosted', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const defaultColumn = {
    size: 200,
    minSize: 50,
    maxSize: 750,
    cell: ({ getValue }) => (
      <div className="pl-2 min-h-10 flex items-center">{getValue()}</div>
    ),
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    defaultColumn,
  });

  return (
    <>
      <section className="flex items-center justify-between py-4 text-white">
        <Input
          placeholder="Filter companies..."
          value={table.getColumn('companyName')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('companyName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={triggerCronFn}>
            Trigger Pipeline
          </Button>
          <ColumnVisibilityConfiguration table={table} />
        </div>
      </section>
      <ResizableTable table={table} columns={columns} />
    </>
  );
}
