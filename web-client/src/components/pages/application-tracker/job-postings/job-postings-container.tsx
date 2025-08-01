import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { JobPostingSortField, SortOrder } from '@vtmp/common/constants';

import { Button } from '#vtmp/web-client/components/base/button';
import { Label } from '#vtmp/web-client/components/base/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#vtmp/web-client/components/base/select';
import { JobPostingsTable } from '#vtmp/web-client/components/pages/application-tracker/job-postings/job-postings-table';
import { CustomError } from '#vtmp/web-client/utils/errors';
import { Input } from '@/components/base/input';
import {
  useCreateApplication,
  useGetJobPostings,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { FilterSelectionButton } from '@/components/pages/application-tracker/job-postings/job-postings-filter';
import { jobPostingsTableColumns } from '@/components/pages/application-tracker/job-postings/job-postings-table-columns';
import {
  IJobPosting,
  JobPostingFilters,
} from '@/components/pages/application-tracker/job-postings/validations';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: JobPostingSortField.DATE_POSTED,
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const defaultColumn = {
    size: 200,
    minSize: 50,
    maxSize: 750,
    cell: ({ getValue }) => (
      <div className="pl-2 min-h-10 flex items-center">{getValue()}</div>
    ),
  };

  const [filters, setFilters] = useState<JobPostingFilters>({
    limit: pagination.pageSize,
    cursor: undefined,
    sortField: JobPostingSortField.DATE_POSTED,
    sortOrder: SortOrder.DESC,
    companyName: undefined,
    jobTitle: undefined,
    location: undefined,
    jobFunction: undefined,
    jobType: undefined,
    postingDateRangeStart: undefined,
    postingDateRangeEnd: undefined,
  });

  const { mutate: createApplicationFn } = useCreateApplication();

  const columns = useMemo(
    () => jobPostingsTableColumns({ createApplicationFn }),
    [createApplicationFn]
  ) as ColumnDef<IJobPosting, unknown>[];

  const { isError, data: jobPostingsData } = useGetJobPostings(filters);

  const [tableData, setTableData] = useState<IJobPosting[]>([]);

  useEffect(() => {
    if (jobPostingsData) {
      setTableData(jobPostingsData.data);
      if (jobPostingsData.cursor !== undefined) {
        setNextCursor(jobPostingsData.cursor);
      } else {
        setNextCursor(undefined);
      }
    }
  }, [jobPostingsData]);

  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    defaultColumn,
  });

  const handleResetPage = () => {
    setNextCursor(undefined);
    setPrevCursors([]);
    setFilters((prev) => ({
      ...prev,
      limit: pagination.pageSize,
      cursor: undefined,
    }));
  };

  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];

      setFilters({
        ...filters,
        sortOrder: desc ? SortOrder.DESC : SortOrder.ASC,
        sortField: id as JobPostingSortField,
      });

      handleResetPage();
    }
  }, [sorting, pagination.pageSize]);

  if (isError) {
    throw new CustomError('Error fetching job postings data');
  }

  return (
    <>
      <section className="flex items-center justify-between py-4">
        <div className="flex gap-4 w-100">
          <Input
            placeholder="Filter companies..."
            value={filters.companyName}
            onChange={(event) => {
              setFilters({
                ...filters,
                companyName: event.target.value,
              });
            }}
            className="max-w-sm flex-grow text-white"
          />
          <FilterSelectionButton filters={filters} setFilters={setFilters} />
        </div>

        <ColumnVisibilityConfiguration table={table} />
      </section>
      <JobPostingsTable table={table} columns={columns} />
      <section className="flex items-center justify-end space-x-2 py-4 text-white pr-3">
        <div className="flex gap-2 items-center mr-20">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={`${pagination.pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleResetPage()}
            disabled={prevCursors.length === 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (prevCursors.length > 0) {
                const updatedPrev = [...prevCursors];
                const lastCursor = updatedPrev.pop();

                setPrevCursors(updatedPrev);
                setFilters((prev) => ({
                  ...prev,
                  cursor: lastCursor,
                }));
                setNextCursor(undefined);
              }
            }}
            disabled={prevCursors.length === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (nextCursor) {
                setPrevCursors((prev) => [...prev, filters.cursor || '']);

                setFilters((prev) => ({
                  ...prev,
                  cursor: nextCursor,
                }));
                setNextCursor(undefined);
              }
            }}
            disabled={!nextCursor}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
        </div>
      </section>
    </>
  );
};
