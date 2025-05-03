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
    queryFn: async () => {
      const response = await request(
        Method.GET,
        '/applications/countByStatus',
        null,
        ApplicationsCountByStatusSchema
      );
      return response.data;
    },
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
      num: ApplicationsCountByStatus?.SUBMITTED ?? 0,
      label: 'Submitted',
      dot: <SubmittedStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.OA ?? 0,
      label: 'OA',
      dot: <OAStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.INTERVIEWING ?? 0,
      label: 'Interviewing',
      dot: <InterviewingStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.OFFERED ?? 0,
      label: 'Offered',
      dot: <OfferedStatusDot />,
    },
    {
      num: ApplicationsCountByStatus?.WITHDRAWN ?? 0,
      label: 'Withdrawn',
      dot: <WithdrawnStatusDot />,
    },
  ];
  return (
    <div className={`grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6`}>
      {infos.map((info, index) => (
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
