import { ApplicationStatus, LinkStatus } from '@vtmp/common/constants';

const statusColorMapping = {
  [ApplicationStatus.SUBMITTED]: 'bg-[#A2BFF0]',
  [ApplicationStatus.OA]: 'bg-[#F49DFF]',
  [ApplicationStatus.INTERVIEWING]: 'bg-[#F8FF6A]',
  [ApplicationStatus.OFFERED]: 'bg-[#A3F890]',
  [ApplicationStatus.WITHDRAWN]: 'bg-[#CAAB94]',
  [ApplicationStatus.REJECTED]: 'bg-[#FEB584]',
  [LinkStatus.PENDING]: 'bg-[#A2BFF0]',
  [LinkStatus.APPROVED]: 'bg-[#A3F890]',
};

export const StatusDot = ({
  status,
}: {
  status: ApplicationStatus | LinkStatus;
}) => {
  const color = statusColorMapping[status];
  return (
    <div
      className={`w-[1rem] h-[1rem] rounded-full ${color} max-lg:w-[0.7rem] max-lg:h-[0.7rem]`}
    />
  );
};
