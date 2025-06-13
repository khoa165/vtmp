import { useState } from 'react';
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
import { Input } from '@/components/base/input';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';
import { ResizableTable } from '@/components/pages/shared/resizable-table';

interface AdminLinksTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AdminLinksTable<TData, TValue>({
  columns,
  data,
}: AdminLinksTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'datePosted', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

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
      <ResizableTable table={table} columns={columns} />
    </>
  );
}
