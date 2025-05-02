import { Card } from '@/components/base/card';
import {
  SubmittedStatusDot,
  OAStatusDot,
  InterviewingStatusDot,
  OfferedStatusDot,
  RejectedStatusDot,
  WithdrawnStatusDot,
} from '@/components/base/status-dots';
import { CountApplicationsByStatusSchema } from '@/components/pages/application-tracker/applications/validation';
import { request } from '@/utils/api';
import { Method } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';

export const StatusBar = () => {
  const {
    isLoading,
    isError,
    error,
    data: ApplicationsCountByStatus,
  } = useQuery({
    queryKey: ['status-bar'],
    queryFn: () =>
      request(
        Method.GET,
        '/applications/applicationsCount',
        null,
        CountApplicationsByStatusSchema
      ),
  });

  if (isLoading) {
    console.log('Application count loading...');
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
      num: ApplicationsCountByStatus?.submittedCount,
      label: 'Submitted',
      dot: <SubmittedStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.oaCount,
      label: 'OA',
      dot: <OAStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.interviewingCount,
      label: 'Interviewing',
      dot: <InterviewingStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.offeredCount,
      label: 'Offered',
      dot: <OfferedStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.rejectedCount,
      label: 'Rejected',
      dot: <RejectedStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.withdrawalCount,
      label: 'Withdrawn',
      dot: <WithdrawnStatusDot />,
    },
  ];
  const filteredInfos = infos.filter((info) => info.num !== undefined);
  return (
    <div
      className={`grid min-md:grid-cols-${filteredInfos.length} w-full gap-4 mb-6 max-md:grid-rows-6`}
    >
      {filteredInfos.map((info, index) => (
        <Card
          key={index}
          className="bg-transparent h-fit cursor-pointer hover:bg-[#FEFEFE] hover:text-[#333333] transition-colors duration-200"
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
