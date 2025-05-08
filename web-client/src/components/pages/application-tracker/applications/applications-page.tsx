import { ApplicationStatusCards } from '@/components/pages/application-tracker/applications/application-status-cards';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { useState } from 'react';

export const ApplicationsPage = () => {
  const [filter, setFilter] = useState({});
  return (
    <div className="w-full h-full p-10">
      <ApplicationStatusCards setFilter={setFilter} />
      <ApplicationsContainer filter={filter} />
    </div>
  );
};
