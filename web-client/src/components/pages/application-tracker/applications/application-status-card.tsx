import { Card } from '@/components/base/card';
import { ApplicationStatus } from '@vtmp/common/constants';
import { Skeleton } from '@/components/base/skeleton';
import { StatusDot } from '@/components/base/status-dot';
import { formatStatus } from '@/utils/helpers';

export const ApplicationStatusCard = ({
  isSkeleton = false,
  status,
  count,
  onClick,
  isSelected,
}: {
  isSkeleton?: boolean;
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
        <div className="text-[2rem] max-lg:text-[1rem] font-bold">
          {isSkeleton ? (
            <Skeleton className="w-[2rem] h-[2rem] max-lg:w-[1.5rem] max-lg:h-[1.5rem] rounded-md" />
          ) : (
            count
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          {isSkeleton ? (
            <>
              <Skeleton className="w-[1rem] h-[1rem] max-lg:w-[0.7rem] max-lg:h-[0.7rem] rounded-full" />
              <Skeleton className="w-[4rem] h-[1rem] max-lg:w-[3rem] max-lg:h-[0.8rem] rounded-md" />
            </>
          ) : status ? (
            <>
              <StatusDot status={status} />
              <span className="font-bold max-lg:text-[0.7rem] text-wrap">
                {formatStatus(status)}
              </span>
            </>
          ) : null}
        </div>
      </section>
    </Card>
  );
};
