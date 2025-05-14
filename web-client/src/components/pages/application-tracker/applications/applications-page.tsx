import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { useState } from 'react';

export const ApplicationsPage = () => {
  const [filter, setFilter] = useState({});
  return (
    <div className="w-full h-full p-10">
      <ApplicationStatusContainer setFilter={setFilter} />
      <ApplicationsContainer filter={filter} />
    </div>
  );
};
