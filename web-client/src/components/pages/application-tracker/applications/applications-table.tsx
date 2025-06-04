import { Input } from '@/components/base/input';
import { useState } from 'react';
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
  ColumnSizingState,
} from '@tanstack/react-table';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';
import { ResizableTable } from '@/components/pages/shared/resizable-table';
import { InterviewDrawer } from '@/components/pages/application-tracker/applications/interview-drawer';
import { IApplication } from '@/components/pages/application-tracker/applications/validation';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ApplicationsTable<TData extends IApplication, TValue>({
  columns,
  data,
  sorting,
  setSorting,
  selectedApplicationId,
  setSelectedApplicationId,
}: DataTableProps<TData, TValue> & {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  selectedApplicationId: string | null;
  setSelectedApplicationId: (id: string | null) => void;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
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
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
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

      <InterviewDrawer
        open={!!selectedApplicationId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplicationId(null);
          }
        }}
        applicationId={selectedApplicationId}
      />
    </>
  );
}
