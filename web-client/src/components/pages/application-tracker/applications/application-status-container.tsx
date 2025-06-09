import { useState } from 'react';

import { Skeleton } from '@/components/base/skeleton';
import { ApplicationStatusCard } from '@/components/pages/application-tracker/applications/application-status-card';
import { ApplicationsFilter } from '@/components/pages/application-tracker/applications/applications-page';
import { useGetApplicationsCountByStatus } from '@/components/pages/application-tracker/applications/hooks/applications';
import { CustomError } from '@/utils/errors';
import { ApplicationStatus } from '@vtmp/common/constants';

export const ApplicationStatusContainer = ({
  setApplicationFilter,
}: {
  setApplicationFilter: (applicationFilter: ApplicationsFilter) => void;
}): React.JSX.Element | null => {
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);

  const {
    isLoading,
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

  if (error) {
    throw new CustomError('Error fetching applications status count');
  }

  const allDisplayedStatus = Object.values(ApplicationStatus).filter(
    (status) => status != ApplicationStatus.REJECTED
  );

  const handleStatusClick = (status: ApplicationStatus) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      setApplicationFilter({});
    } else {
      setSelectedStatus(status);
      setApplicationFilter({ status });
    }
  };

  if (allDisplayedStatus.length === 0) {
    throw new Error('No status available to display');
  }

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
