import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  ColumnSizingState,
  Row,
} from '@tanstack/react-table';
import { useState } from 'react';

import { SendInvitation } from '#vtmp/web-client/components/pages/admins/invitations/send-invitation';
import { IInvitationSchema } from '#vtmp/web-client/components/pages/admins/invitations/validation';
import { Input } from '@/components/base/input';
import { ResizableTable } from '@/components/pages/shared/resizable-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function InvitationTable<TData extends IInvitationSchema, TValue>({
  columns,
  data,
  sorting,
  setSorting,
}: DataTableProps<TData, TValue> & {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
}) {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const globalFilterFn = (
    row: Row<TData>,
    _columnId: string,
    filterValue: string
  ) => {
    const name = row.original.receiverName.toLowerCase();
    const email = row.original.receiverEmail.toLowerCase();
    const searchValue = filterValue.toLowerCase();

    return name.includes(searchValue) || email.includes(searchValue);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    globalFilterFn,
    state: {
      sorting,
      columnSizing,
      rowSelection,
      globalFilter,
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
        <SendInvitation />
        {data.length > 0 && (
          <Input
            placeholder="Search"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm text-white"
          />
        )}
      </section>
      {data.length > 0 ? (
        <ResizableTable table={table} columns={columns} />
      ) : (
        <div className="flex items-center justify-start">
          <p className="text-lg text-muted-foreground">
            No existing invitations found. Start inviting now!
          </p>
        </div>
      )}
    </>
  );
}
