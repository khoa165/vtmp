import { JobPostingsTable } from '@/components/pages/application-tracker/job-postings/job-postings-table';
import { jobPostingsTableColumns } from '@/components/pages/application-tracker/job-postings/job-postings-table-columns';
import {
  useCreateApplication,
  useGetJobPostings,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { useMemo, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { Skeleton } from '@/components/base/skeleton';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const {
    isLoading,
    isError,
    error,
    data: jobPostingsData,
  } = useGetJobPostings();
  const { mutate: createApplicationFn } = useCreateApplication();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => jobPostingsTableColumns({ createApplicationFn }),
    [createApplicationFn]
  );

  // const [filter, setFilter] = useState('');
  // const [data, setData] = useState('');

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
    <JobPostingsTable
      columns={columns}
      data={jobPostingsData}
      sorting={sorting}
      setSorting={setSorting}
    />
  );
};
