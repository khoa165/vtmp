import { Card } from '@/components/base/card';
import {
  SubmittedStatusDot,
  OAStatusDot,
  InterviewingStatusDot,
  OfferedStatusDot,
  RejectedStatusDot,
  WithdrawnStatusDot,
} from '@/components/base/status-dots';

export const StatusBar = () => {
  const infos = [
    {
      num: 250,
      label: 'Submitted',
      dot: <SubmittedStatusDot />,
    },
    {
      num: 25,
      label: 'OA',
      dot: <OAStatusDot />,
    },
    {
      num: 12,
      label: 'Interviewing',
      dot: <InterviewingStatusDot />,
    },
    {
      num: 9,
      label: 'Offered',
      dot: <OfferedStatusDot />,
    },
    {
      num: 15,
      label: 'Rejected',
      dot: <RejectedStatusDot />,
    },
    {
      num: 2,
      label: 'Withdrawn',
      dot: <WithdrawnStatusDot />,
    },
  ];
  return (
    <div className="grid min-md:grid-cols-6 w-full gap-4 mb-6 max-md:grid-rows-6">
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
