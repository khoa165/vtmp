import { Card } from '@/components/base/card';
import { StatusDot } from '@/components/base/status-dot';
import { useGetApplicationsCountByStatus } from '@/components/pages/application-tracker/applications/hooks/applications';
import { titleCase } from '@/utils/helpers';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';

export const ApplicationStatusCards = ({
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
    console.log('Applications count loading...');
    return <span>Loading applications count data...</span>;
  }

  if (isError) {
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
    <div className={`grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6`}>
      {allDisplayedStatus.map((displayedStatus, index) => (
        <Card
          key={index}
          className={`bg-transparent h-fit cursor-pointer transition-colors duration-200 ${
            selectedStatus === displayedStatus
              ? 'bg-[#FEFEFE] text-[#333333]'
              : 'hover:bg-[#FEFEFE] hover:text-[#333333]'
          }`}
          onClick={() => handleStatusClick(displayedStatus)}
        >
          <section className="flex flex-col items-center justify-center">
            <div className="text-[2rem] max-lg:text-[1rem] font-bold">
              {ApplicationsCountByStatus?.[displayedStatus]}
            </div>
            <div className="flex flex-row items-center gap-2">
              <StatusDot status={displayedStatus} />
              <span className="font-bold max-lg:text-[0.7rem] text-wrap">
                {displayedStatus === ApplicationStatus.OA
                  ? displayedStatus
                  : titleCase(displayedStatus)}
              </span>
            </div>
          </section>
        </Card>
      ))}
    </div>
  );
};
