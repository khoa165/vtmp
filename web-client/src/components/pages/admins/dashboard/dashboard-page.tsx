import { DashBoardContainer } from '@/components/pages/admins/dashboard/dashboard-container';
import { LinkStatusCards } from '@/components/pages/admins/dashboard/dashboard-status';
import { useState } from 'react';
import { LinkStatus } from '@vtmp/common/constants';

export interface LinksFilter {
  status?: LinkStatus;
}

export const DashBoardPage = () => {
  const [linksFilter, setLinksFilter] = useState<LinksFilter>({});

  return (
    <div className="w-full px-10 min-h-screen text-white flex flex-col justify-center gap-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <LinkStatusCards setLinksFilter={setLinksFilter} />
      <DashBoardContainer linksFilter={linksFilter} />
    </div>
  );
};
