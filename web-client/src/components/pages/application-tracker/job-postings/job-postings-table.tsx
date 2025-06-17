import { Input } from '@/components/base/input';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';
import { ResizableTable } from '@/components/pages/shared/resizable-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function JobPostingsTable<TData, TValue>({
  columns,
  data,
  sorting,
  setSorting,
}: DataTableProps<TData, TValue> & {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <section className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter companies..."
          value={table.getColumn('companyName')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('companyName')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <ColumnVisibilityConfiguration table={table} />
      </section>
      <ResizableTable table={table} columns={columns} testIdPrefix="job" />
    </>
  );
}
