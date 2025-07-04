import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  ColumnSizingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Input } from '@/components/base/input';
import { ResizableTable } from '@/components/pages/shared/resizable-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function InvitationTable<TData, TValue>({
  columns,
  data,
  sorting,
  setSorting,
}: DataTableProps<TData, TValue> & {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
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
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      columnFilters,
      columnSizing,
      rowSelection,
    },
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 750,
    },
  });

  return (
    <>
      <section className="flex items-center justify-between py-4">
        <Input
          placeholder="Search by email"
          value={table.getColumn('receiverEmail')?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn('receiverEmail')?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-white"
        />
      </section>
      <ResizableTable table={table} columns={columns} />
    </>
  );
}
