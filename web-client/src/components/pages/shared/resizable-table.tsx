import {
  ColumnDef,
  flexRender,
  Header,
  Table as TanstackTable,
} from '@tanstack/react-table';

import { Button } from '@/components/base/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/table';

const ColumnResizer = <TData, TValue>({
  header,
}: {
  header: Header<TData, TValue>;
}) => {
  if (header.column.getCanResize() === false) return <></>;

  return (
    <div
      {...{
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `absolute top-0 right-0 cursor-col-resize w-px h-full bg-vtmp-light-grey hover:w-1`,
        style: {
          userSelect: 'none',
          touchAction: 'none',
        },
      }}
    />
  );
};

interface ResizableTableProps<TData, TValue> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export function ResizableTable<TData, TValue>({
  table,
  columns,
}: ResizableTableProps<TData, TValue>) {
  return (
    <>
      <section className="rounded-md border border-foreground">
        <div className="overflow-x-auto rounded-md">
          <Table>
            <TableHeader className="bg-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-background"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <ColumnResizer header={header} />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-foreground py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-white"
                  >
                    No invitations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="flex items-center justify-end space-x-2 py-4 text-white">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </section>
    </>
  );
}
