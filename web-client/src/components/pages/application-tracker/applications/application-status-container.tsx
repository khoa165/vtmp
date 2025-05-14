import { useGetApplicationsCountByStatus } from '@/components/pages/application-tracker/applications/hooks/applications';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { ApplicationStatusCard } from '@/components/pages/application-tracker/applications/application-status-card';

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
          <ApplicationStatusCard key={index} isSkeleton={true} />
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
    // <div className={`grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6`}>
    //   {allDisplayedStatus.map((displayedStatus, index) => (
    //     <Card
    //       key={index}
    //       className={`active:bg-gray-300 bg-transparent h-fit cursor-pointer transition-colors duration-200 ${
    //         selectedStatus === displayedStatus
    //           ? 'bg-[#FEFEFE] text-[#333333]'
    //           : 'hover:bg-[#FEFEFE] hover:text-[#333333]'
    //       }`}
    //       onClick={() => handleStatusClick(displayedStatus)}
    //     >
    //       <section className="flex flex-col items-center justify-center">
    //         <div className="text-[2rem] max-lg:text-[1rem] font-bold">
    //           {ApplicationsCountByStatus?.[displayedStatus]}
    //         </div>
    //         <div className="flex flex-row items-center gap-2">
    //           <StatusDot status={displayedStatus} />
    //           <span className="font-bold max-lg:text-[0.7rem] text-wrap">
    //             {formatStatus(displayedStatus)}
    //           </span>
    //         </div>
    //       </section>
    //     </Card>
    //   ))}
    // </div>
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
