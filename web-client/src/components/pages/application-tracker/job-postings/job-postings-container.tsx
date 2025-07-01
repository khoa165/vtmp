import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { JobPostingSortField, SortOrder } from '@vtmp/common/constants';

import { Input } from '@/components/base/input';
import { Skeleton } from '@/components/base/skeleton';
import {
  useCreateApplication,
  useGetJobPostings,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { jobPostingsTableColumns } from '@/components/pages/application-tracker/job-postings/job-postings-table-columns';
import {
  IJobPosting,
  JobPostingFilters,
} from '@/components/pages/application-tracker/job-postings/validations';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';
import { ResizableTable } from '@/components/pages/shared/resizable-table';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [sortField, setSortField] = useState<JobPostingSortField>(
    JobPostingSortField.DATE_POSTED
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const filters: JobPostingFilters = useMemo(
    () => ({
      limit: pagination.pageSize,
      cursor: undefined,
      sortField,
      sortOrder,
      companyName: undefined,
      jobTitle: undefined,
      location: undefined,
      jobFunction: undefined,
      jobType: undefined,
      postingDateRangeStart: undefined,
      postingDateRangeEnd: undefined,
    }),
    [pagination.pageSize, sortField, sortOrder]
  );

  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      setSortField(id as JobPostingSortField);
      setSortOrder(desc ? SortOrder.DESC : SortOrder.ASC);
    }
  }, [sorting]);

  const { mutate: createApplicationFn } = useCreateApplication();

  const columns = useMemo(
    () => jobPostingsTableColumns({ createApplicationFn }),
    [createApplicationFn]
  ) as ColumnDef<IJobPosting, unknown>[];

  const {
    isLoading,
    isError,
    error,
    data: jobPostingsData,
  } = useGetJobPostings(filters);

  const table = useReactTable({
    data: jobPostingsData?.data ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-10 w-[24rem] rounded-md" />
          <Skeleton className="h-10 w-[8rem] rounded-md" />
        </div>
        <Skeleton className="h-[32rem] w-full rounded-xl" />
      </>
    );
  }

  if (isError) {
    console.error('Error fetching job postings data:', error);
    return null;
  }

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
};
