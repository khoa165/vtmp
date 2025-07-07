import { JobPostingsTable } from '@/components/pages/application-tracker/job-postings/job-postings-table';
import { jobPostingsTableColumns } from '@/components/pages/application-tracker/job-postings/job-postings-table-columns';
import {
  useCreateApplication,
  useGetJobPostings,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { useMemo, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { Skeleton } from '@/components/base/skeleton';
import { FilterSelectionButton } from '@/components/pages/application-tracker/job-postings/job-postings-filter';
import type { FilterState } from './job-postings-drawer';
import { useSearchParams } from 'react-router-dom';
import { JobFunction, JobType } from '@vtmp/common/constants';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const isJobFunction = (val: any): val is JobFunction =>
    Object.values(JobFunction).includes(val as JobFunction);

  const isJobType = (val: any): val is JobType =>
    Object.values(JobType).includes(val as JobType);
  
  const filtersFromParams = useMemo(() => {
    const jobFunctionParam = searchParams.get('jobFunction');
    const jobTypeParam = searchParams.get('jobType');

    return {
      jobTitle: searchParams.get('jobTitle') ?? undefined,
      location: searchParams.get('location') ?? undefined,
      jobFunction: isJobFunction(jobFunctionParam)
        ? jobFunctionParam
        : undefined,
      jobType: isJobType(jobTypeParam) ? jobTypeParam : undefined,
      postingDateRangeStart: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      postingDateRangeEnd: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
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
    return null;
  }

  if (!jobPostingsData || jobPostingsData.length === 0) {
    // TODO-(QuangMinhNguyen27405): Replace `return null` with an empty state message or component
    return null;
  }

  return (
    <>
      <FilterSelectionButton onApply={setFilters} />
      <JobPostingsTable
        columns={columns}
        data={jobPostingsData}
        sorting={sorting}
        setSorting={setSorting}
      />
    </>
  );
};
