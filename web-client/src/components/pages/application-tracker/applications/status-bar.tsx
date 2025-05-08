import { Card } from '@/components/base/card';
import {
  SubmittedStatusDot,
  OAStatusDot,
  InterviewingStatusDot,
  OfferedStatusDot,
  WithdrawnStatusDot,
} from '@/components/base/status-dots';
import { useGetApplicationsCountByStatus } from '@/components/pages/application-tracker/applications/hooks/applications';
import { titleCase } from '@/utils/helpers';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';

export const StatusBar = ({ setFilter }): React.JSX.Element | null => {
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

  const allDisplayedStatus = [
    {
      num: ApplicationsCountByStatus?.SUBMITTED,
      dot: <SubmittedStatusDot />,
      status: ApplicationStatus.SUBMITTED,
    },
    {
      num: ApplicationsCountByStatus?.OA,
      dot: <OAStatusDot />,
      status: ApplicationStatus.OA,
    },
    {
      num: ApplicationsCountByStatus?.INTERVIEWING,
      dot: <InterviewingStatusDot />,
      status: ApplicationStatus.INTERVIEWING,
    },
    {
      num: ApplicationsCountByStatus?.OFFERED,
      dot: <OfferedStatusDot />,
      status: ApplicationStatus.OFFERED,
    },
    {
      num: ApplicationsCountByStatus?.WITHDRAWN,
      dot: <WithdrawnStatusDot />,
      status: ApplicationStatus.WITHDRAWN,
    },
  ];
  // What I want to do: I want register when I click on the status box
  // it has to reinvalidate GET_APPLICATIONS queryKey and refetch useGetApplications with filter being the status selected
  const handleStatusClick = (status: ApplicationStatus) => {
    // If the already existing status match the new status
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
            selectedStatus === displayedStatus.status
              ? 'bg-[#FEFEFE] text-[#333333]'
              : 'hover:bg-[#FEFEFE] hover:text-[#333333]'
          }`}
          onClick={() => handleStatusClick(displayedStatus.status)}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-[2rem] max-lg:text-[1rem] font-bold">
              {displayedStatus.num}
            </div>
            <div className="flex flex-row items-center gap-2">
              {displayedStatus.dot}
              <span className="font-bold max-lg:text-[0.7rem] text-wrap">
                {displayedStatus.status === ApplicationStatus.OA
                  ? displayedStatus.status
                  : titleCase(displayedStatus.status)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
