import { Card } from '@/components/base/card';
import { ApplicationStatus } from '@vtmp/common/constants';
import { StatusDot } from '@/components/base/status-dot';
import { formatStatus } from '@/utils/helpers';
import { statusColorMap } from '@/utils/constants';

export const ApplicationStatusCard = ({
  status,
  count,
  onClick,
  isSelected,
}: {
  status?: ApplicationStatus;
  count?: number;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  return (
    <Card
      className={`active:bg-gray-300 bg-transparent h-fit cursor-pointer transition-colors duration-200 ${
        isSelected
          ? 'bg-[#FEFEFE] text-[#333333]'
          : 'hover:bg-[#FEFEFE] hover:text-[#333333]'
      }`}
      onClick={onClick}
    >
      <section className="flex flex-col items-center justify-center">
        <div className="text-[2rem] max-lg:text-[1rem] font-bold">{count}</div>
        {status ? (
          <div className="flex flex-row items-center gap-2">
            <StatusDot status={status} colorMap={statusColorMap} />
            <span className="font-bold max-lg:text-[0.7rem] text-wrap">
              {formatStatus(status)}
            </span>
          </div>
        ) : null}
      </section>
    </Card>
  );
};
