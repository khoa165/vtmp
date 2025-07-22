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

import { Button } from '#vtmp/web-client/components/base/button';
import { JobPostingsTable } from '#vtmp/web-client/components/pages/application-tracker/job-postings/job-postings-table';
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const defaultColumn = {
    size: 200,
    minSize: 50,
    maxSize: 750,
    cell: ({ getValue }) => <div className="pl-2">{getValue()}</div>,
  };

  const [filters, setFilters] = useState<JobPostingFilters>({
    limit: 10,
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
      if (jobPostingsData.cursor !== undefined) {
        setNextCursor(jobPostingsData.cursor);
      }
    }
  }, [jobPostingsData]);

  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    autoResetPageIndex: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    defaultColumn,
  });

  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];

      setFilters({
        ...filters,
        sortOrder: desc ? SortOrder.DESC : SortOrder.ASC,
        sortField: id as JobPostingSortField,
      });

      setNextCursor(undefined);
      setPrevCursors([]);
      setFilters((prev) => ({
        ...prev,
        cursor: undefined,
      }));
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
      <JobPostingsTable table={table} columns={columns} />
      <section className="flex items-center justify-end space-x-2 py-4 text-white">
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
          Previous
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
          Next
        </Button>
      </section>
    </>
  );
};
