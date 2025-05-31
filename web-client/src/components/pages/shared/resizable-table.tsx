import { Button } from '@/components/base/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/table';
import {
  ColumnDef,
  flexRender,
  Header,
  Table as TanstackTable,
} from '@tanstack/react-table';

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
  handleRowClick?: (rowData: TData) => void;
}

export function ResizableTable<TData, TValue>({
  table,
  columns,
  handleRowClick,
}: ResizableTableProps<TData, TValue>) {
  return (
    <>
      <section className="rounded-md border border-foreground">
        <div className="overflow-x-scroll">
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
                    onClick={() => handleRowClick?.(row.original)}
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
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-foreground hover:text-background hover:bg-foreground"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-foreground hover:text-background hover:bg-foreground"
        >
          Next
        </Button>
      </section>
    </>
  );
}
