import { ApplicationStatus, LinkStatus } from '@vtmp/common/constants';

export const StatusDot = ({
  status,
  colorMapping,
}: {
  status: ApplicationStatus | LinkStatus;
  colorMapping: Record<ApplicationStatus | LinkStatus, string>;
}) => {
  const color = colorMapping[status];
  return (
    <div
      className={`w-[1rem] h-[1rem] rounded-full ${color} max-lg:w-[0.7rem] max-lg:h-[0.7rem]`}
    />
  );
};
