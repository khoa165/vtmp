import { DashBoardContainer } from '@/components/pages/admins/dashboard/dashboard-container';
import { LinkStatusCards } from '@/components/pages/admins/dashboard/dashboard-status';
import React, { useState } from 'react';

export const DashBoardPage = () => {
  const [filter, setFilter] = useState({});
  return (
    <div className="container p-10 h-full ">
      <DashBoardContainer filter={filter} />
      <LinkStatusCards setFilter={setFilter} />
    </div>
  );
};
