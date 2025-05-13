import { DashBoardContainer } from '@/components/pages/admins/dashboard/dashboard-container';
import { LinkStatusCards } from '@/components/pages/admins/dashboard/dashboard-status';
import React, { useState } from 'react';

export const DashBoardPage = () => {
  const [filter, setFilter] = useState({});
  return (
    <div className="w-full p-10 h-full text-white flex flex-col justify-start gap-6">
      <h1 className="text-[2rem] font-bold">Admin DashBoard</h1>
      <LinkStatusCards setFilter={setFilter} />
      <DashBoardContainer filter={filter} />
    </div>
  );
};
