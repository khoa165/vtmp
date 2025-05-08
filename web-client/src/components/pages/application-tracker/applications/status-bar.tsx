import { Card } from '@/components/base/card';
import {
  SubmittedStatusDot,
  OAStatusDot,
  InterviewingStatusDot,
  OfferedStatusDot,
  WithdrawnStatusDot,
} from '@/components/base/status-dots';
import { ApplicationsCountByStatusSchema } from '@/components/pages/application-tracker/applications/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
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
  } = useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/applications/count-by-status',
        schema: ApplicationsCountByStatusSchema,
        options: { includeOnlyDataField: true },
      }),
  });

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

  const infos = [
    {
      num: ApplicationsCountByStatus?.SUBMITTED,
      label: 'Submitted',
      dot: <SubmittedStatusDot />,
      status: ApplicationStatus.SUBMITTED,
    },
    {
      num: ApplicationsCountByStatus?.OA,
      label: 'OA',
      dot: <OAStatusDot />,
      status: ApplicationStatus.OA,
    },
    {
      num: ApplicationsCountByStatus?.INTERVIEWING,
      label: 'Interviewing',
      dot: <InterviewingStatusDot />,
      status: ApplicationStatus.INTERVIEWING,
    },
    {
      num: ApplicationsCountByStatus?.OFFERED,
      label: 'Offered',
      dot: <OfferedStatusDot />,
      status: ApplicationStatus.OFFERED,
    },
    {
      num: ApplicationsCountByStatus?.WITHDRAWN,
      label: 'Withdrawn',
      dot: <WithdrawnStatusDot />,
      status: ApplicationStatus.WITHDRAWN,
    },
  ];
  // What I want to do: I want register when I click on the status box
  // it has to reinvalidate GET_APPLICATIONS queryKey and refetch useGetApplications with filter being the status selected
  const handleStatusClick = (status: ApplicationStatus) => {
    // queryClient.invalidateQueries({ queryKey: [QueryKey.GET_APPLICATIONS] });
    // If the already existing state match the new status
    if (selectedStatus === status) {
      // Clear the status and refetch
      setSelectedStatus(null);
      setFilter({});
    } else {
      setSelectedStatus(status);
      setFilter({ status });
    }
  };
  return (
    <div className={`grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6`}>
      {infos.map((info, index) => (
        <Card
          key={index}
          className={`bg-transparent h-fit cursor-pointer transition-colors duration-200 ${
            selectedStatus === info.status
              ? 'bg-[#FEFEFE] text-[#333333]' // Apply shaded style when selected
              : 'hover:bg-[#FEFEFE] hover:text-[#333333]' // Apply hover style when not selected
          }`}
          onClick={() => handleStatusClick(info.status)}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-[2rem] max-lg:text-[1rem] font-bold">
              {info.num}
            </div>
            <div className="flex flex-row items-center gap-2">
              {info.dot}
              <span className="font-bold max-lg:text-[0.7rem] text-wrap">
                {info.label}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
