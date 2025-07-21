import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { JobPostingSortField, SortOrder } from '@vtmp/common/constants';

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
import { ResizableTable } from '@/components/pages/shared/resizable-table';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const defaultColumn = {
    size: 200,
    minSize: 50,
    maxSize: 750,
    cell: ({ getValue }) => <div className="pl-2">{getValue()}</div>,
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

  const { data: jobPostingsData } = useGetJobPostings(filters);

  const [tableData, setTableData] = useState<IJobPosting[]>([]);

  useEffect(() => {
    if (jobPostingsData) {
      setTableData(jobPostingsData.data);
    }
  }, [jobPostingsData]);

  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    defaultColumn,
  });

  useEffect(() => {
    console.log('Filters updated:', filters);

    if (sorting.length > 0) {
      const { id, desc } = sorting[0];

      setFilters({
        ...filters,
        sortOrder: desc ? SortOrder.DESC : SortOrder.ASC,
        sortField: id as JobPostingSortField,
      });
    }
  }, [sorting]);

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
      <ResizableTable table={table} columns={columns} />
    </>
  );
};
