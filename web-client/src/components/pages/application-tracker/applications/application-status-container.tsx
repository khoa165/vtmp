import { useGetApplicationsCountByStatus } from '@/components/pages/application-tracker/applications/hooks/applications';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { ApplicationStatusCard } from '@/components/pages/application-tracker/applications/application-status-card';
import { Skeleton } from '@/components/base/skeleton';

export const ApplicationStatusContainer = ({
  setFilter,
}): React.JSX.Element | null => {
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);

  const {
    isLoading,
    isError,
    error,
    data: ApplicationsCountByStatus,
  } = useGetApplicationsCountByStatus();

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[8rem] rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    // TODO-(QuangMinhNguyen27405/dsmai) : Remove this and add a toast error message. Add react-error-boundary
    console.error('Error fetching application count data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load summary data.'}</span>
    // );
    return null;
  }

  const allDisplayedStatus = Object.values(ApplicationStatus).filter(
    (status) => status != ApplicationStatus.REJECTED
  );

  const handleStatusClick = (status: ApplicationStatus) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      setFilter({});
    } else {
      setSelectedStatus(status);
      setFilter({ status });
    }
  };

  return (
    <div className="grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6">
      {allDisplayedStatus.map((displayedStatus, index) => (
        <ApplicationStatusCard
          key={index}
          status={displayedStatus}
          count={ApplicationsCountByStatus?.[displayedStatus]}
          onClick={() => handleStatusClick(displayedStatus)}
          isSelected={selectedStatus === displayedStatus}
        />
      ))}
    </div>
  );
};
