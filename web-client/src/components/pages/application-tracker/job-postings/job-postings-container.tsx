import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { JobFunction, JobType } from '@vtmp/common/constants';

import type { FilterState } from '#vtmp/web-client/components/pages/application-tracker/job-postings/job-postings-drawer';
import { Input } from '@/components/base/input';
import { Skeleton } from '@/components/base/skeleton';
import {
  useCreateApplication,
  useGetJobPostings,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { FilterSelectionButton } from '@/components/pages/application-tracker/job-postings/job-postings-filter';
import { jobPostingsTableColumns } from '@/components/pages/application-tracker/job-postings/job-postings-table-columns';
import { ColumnVisibilityConfiguration } from '@/components/pages/shared/column-visibility-configuration';
import { ResizableTable } from '@/components/pages/shared/resizable-table';
import { CustomError } from '@/utils/errors';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const isJobFunction = (val: string | null): val is JobFunction =>
    Object.values(JobFunction).includes(val as JobFunction);

  const isJobType = (val: string | null): val is JobType =>
    Object.values(JobType).includes(val as JobType);

  const filtersFromParams = useMemo(() => {
    const jobFunctionParam = searchParams.get('jobFunction');
    const jobTypeParam = searchParams.get('jobType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    return {
      jobTitle: searchParams.get('jobTitle') ?? undefined,
      location: searchParams.get('location') ?? undefined,
      jobFunction: isJobFunction(jobFunctionParam)
        ? jobFunctionParam
        : undefined,
      jobType: isJobType(jobTypeParam) ? jobTypeParam : undefined,
      postingDateRangeStart: startDate ? new Date(startDate) : undefined,
      postingDateRangeEnd: endDate ? new Date(endDate) : undefined,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>(filtersFromParams);

  const {
    isLoading,
    isError,
    error,
    data: jobPostingsData,
  } = useGetJobPostings(filters);
  const { mutate: createApplicationFn } = useCreateApplication();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => jobPostingsTableColumns({ createApplicationFn }),
    [createApplicationFn]
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const defaultColumn = {
    size: 200,
    minSize: 50,
    maxSize: 750,
    cell: ({ getValue }) => (
      <div className="pl-2 min-h-10 flex items-center">{getValue()}</div>
    ),
  };

  const table = useReactTable({
    data: jobPostingsData ?? [],
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
    defaultColumn,
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
    // TODO-(QuangMinhNguyen27405): Remove this console log and add a toast error message
    console.error('Error fetching job postings data:', error);
    throw new CustomError('Error fetching job postings data');
  }

  return (
    <>
      <section className="flex items-center justify-between py-4">
        <div className="flex gap-4 w-100">
          <Input
            placeholder="Filter companies..."
            value={table.getColumn('companyName')?.getFilterValue() as string}
            onChange={(event) =>
              table.getColumn('companyName')?.setFilterValue(event.target.value)
            }
            className="max-w-sm flex-grow text-white"
          />
          <FilterSelectionButton onApply={setFilters} />
        </div>

        <ColumnVisibilityConfiguration table={table} />
      </section>
      <ResizableTable table={table} columns={columns} testIdPrefix="job"/>
    </>
  );
};
