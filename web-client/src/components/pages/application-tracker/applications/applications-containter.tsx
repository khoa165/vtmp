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
import { ApplicationsFilter } from '@/components/pages/application-tracker/applications/applications-page';
import { CustomError } from '@/utils/errors';
import { InterviewDrawer } from '@/components/pages/application-tracker/applications/interview-drawer';
import { ErrorBoundaryWrapper } from '@/components/base/error-boundary';

export const ApplicationsContainer = ({
  applicationFilter,
}: {
  applicationFilter: ApplicationsFilter;
}): React.JSX.Element | null => {
  const {
    isLoading,
    error,
    data: applicationsData,
  } = useGetApplications(applicationFilter);

  const { mutate: deleteApplicationFn } = useDeleteApplication();
  const { mutate: updateApplicationStatusFn } = useUpdateApplicationStatus();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string>('');

  const handleOpenDrawer = (id: string) => {
    setSelectedApplicationId(id);
    setOpenDrawer(true);
  };

  const columns = useMemo(
    () =>
      applicationsTableColumns({
        deleteApplicationFn,
        updateApplicationStatusFn,
        handleOpenDrawer,
      }),
    [deleteApplicationFn, updateApplicationStatusFn, handleOpenDrawer]
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

  if (error) {
    console.error('Error fetching applications data:', error);
    throw new CustomError('Error fetching applications data');
  }

  if (!applicationsData || applicationsData.length === 0) {
    // TODO-(QuangMinhNguyen27405/dsmai): Replace `return null` with an empty state message or component
    // we shouldn't just return null when mentee has no application yet
    return null;
  }

  return (
    <>
      <ApplicationsTable
        columns={columns}
        data={applicationsData}
        sorting={sorting}
        setSorting={setSorting}
        selectedApplicationId={selectedApplicationId}
      />
      <ErrorBoundaryWrapper customText="Interview Drawer">
        <InterviewDrawer
          open={openDrawer}
          onOpenChange={setOpenDrawer}
          applicationId={selectedApplicationId}
        />
      </ErrorBoundaryWrapper>
    </>
  );
};
