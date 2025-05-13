import { Card } from '@/components/base/card';
import { StatusDot } from '@/components/base/status-dot';
import { useGetLinksCountByStatus } from '@/components/pages/admins/dashboard/hooks/dashboard';
import { titleCase } from '@/utils/helpers';
import { LinkStatus } from '@vtmp/common/constants';
import { useState } from 'react';

export const LinkStatusCards = ({ setFilter }): React.JSX.Element | null => {
  const [selectedStatus, setSelectedStatus] = useState<LinkStatus | null>(null);

  const {
    isLoading,
    isError,
    error,
    data: LinksCountByStatus,
  } = useGetLinksCountByStatus();

  if (isLoading) {
    console.log('Links count loading...');
    return <span>Loading links count data...</span>;
  }

  if (isError) {
    console.error('Error fetching application count data:', error);
    return (
      <span>Error: {error.message || 'Failed to load summary data.'}</span>
    );
  }

  const allDisplayedStatus = Object.values(LinkStatus);

  // What I want to do: I want register when I click on the status box
  // it has to reinvalidate GET_APPLICATIONS queryKey and refetch useGetApplications with filter being the status selected
  const handleStatusClick = (status: LinkStatus) => {
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
    <div className={`grid grid-cols-3 w-full gap-4 mb-6 max-md:grid-rows-6`}>
      {allDisplayedStatus.map((displayedStatus, index) => (
        <Card
          key={index}
          className={`bg-transparent h-fit cursor-pointer transition-colors duration-200 ${
            selectedStatus === displayedStatus
              ? 'bg-[#FEFEFE] text-[#333333]'
              : 'hover:bg-[#FEFEFE] hover:text-[#333333]'
          }`}
          onClick={() => handleStatusClick(displayedStatus)}
        >
          <section className="flex flex-col items-center justify-center">
            <div className="text-[2rem] max-lg:text-[1rem] font-bold">
              {LinksCountByStatus?.[displayedStatus]}
            </div>
            <div className="flex flex-row items-center gap-2">
              <StatusDot status={displayedStatus} />
              <span className="font-bold max-lg:text-[0.7rem] text-wrap">
                {titleCase(displayedStatus)}
              </span>
            </div>
          </section>
        </Card>
      ))}
    </div>
  );
};
