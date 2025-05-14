import { applicationsTableColumns } from '@/components/pages/application-tracker/applications/applications-table-columns';
import { ApplicationsTable } from '@/components/pages/application-tracker/applications/applications-table';
import {
  useGetApplications,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/components/pages/application-tracker/applications/hooks/applications';
import { useMemo, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { Skeleton } from '@/components/base/skeleton';

export const ApplicationsContainer = ({ filter }): React.JSX.Element | null => {
  const {
    isLoading,
    isError,
    error,
    data: applicationsData,
  } = useGetApplications(filter);
  const { mutate: deleteApplicationFn } = useDeleteApplication();
  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      applicationsTableColumns({
        deleteApplicationFn,
        updateApplicationStatusFn,
      }),
    [deleteApplicationFn, updateApplicationStatusFn]
  );

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between py-4">
          {/* Skeleton for Filter Input */}
          <Skeleton className="h-10 w-[24rem] rounded-md" />

          {/* Skeleton for Dropdown Menu Button */}
          <Skeleton className="h-10 w-[8rem] rounded-md" />
        </div>
        {/* Skeleton for the Application Table */}
        <Skeleton className="h-[32rem] w-full rounded-xl" />
      </>
    );
  }

  if (isError) {
    // TODO-(QuangMinhNguyen27405/dsmai) : Remove this and add a toast error message. Add react-error-boundary
    console.error('Error fetching applications data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load applications data.'}</span>
    // );
    return null;
  }

  if (!applicationsData || applicationsData.length === 0) {
    // TODO-(QuangMinhNguyen27405/dsmai): Replace `return null` with an empty state message or component
    // we shouldn't just return null when mentee has no application yet
    return null;
  }

  return (
    <ApplicationsTable
      columns={columns}
      data={applicationsData}
      sorting={sorting}
      setSorting={setSorting}
    />
  );
};
