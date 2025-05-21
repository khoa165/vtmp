import { Card } from '@/components/base/card';
import { StatusDot } from '@/components/base/status-dot';
import { Skeleton } from '@/components/base/skeleton';
import { useGetLinksCountByStatus } from '@/components/pages/admins/dashboard/hooks/dashboard';
import { formatStatus } from '@/utils/helpers';
import { LinkStatus } from '@vtmp/common/constants';
import { useState } from 'react';
import { StatusToColorMapping } from '@/utils/constants';

interface LinkStatusCardsProps {
  setLinksFilter: (filter: { status?: LinkStatus }) => void;
}

export const LinkStatusCards = ({
  setLinksFilter,
}: LinkStatusCardsProps): React.JSX.Element | null => {
  const [selectedStatus, setSelectedStatus] = useState<LinkStatus | null>(null);

  const {
    isLoading,
    error,
    data: linksCountByStatus,
  } = useGetLinksCountByStatus();

  const allStatuses = Object.values(LinkStatus);

  const handleStatusClick = (status: LinkStatus) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      setLinksFilter({});
    } else {
      setSelectedStatus(status);
      setLinksFilter({ status });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4 w-full mb-6 max-md:grid-rows-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-[8rem] rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error fetching link count data:', error);
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-md:grid-rows-6">
      {allStatuses.map((status) => {
        const isSelected = selectedStatus === status;
        const cardStyle = isSelected
          ? 'bg-[#FEFEFE] text-[#333333]'
          : 'hover:bg-[#FEFEFE] hover:text-[#333333]';

        return (
          <Card
            key={status}
            className={`bg-transparent cursor-pointer transition-colors duration-200 ${cardStyle} active:bg-gray-400`}
            onClick={() => handleStatusClick(status)}
            aria-pressed={isSelected}
          >
            <section className="flex flex-col items-center justify-center py-4">
              <div className="text-[2rem] font-bold max-lg:text-[1rem]">
                {linksCountByStatus?.[status] ?? 0}
              </div>
              <div className="flex items-center gap-2">
                <StatusDot
                  status={status}
                  colorMapping={StatusToColorMapping}
                />
                <span className="font-bold text-wrap max-lg:text-[0.7rem]">
                  {formatStatus(status)}
                </span>
              </div>
            </section>
          </Card>
        );
      })}
    </div>
  );
};
