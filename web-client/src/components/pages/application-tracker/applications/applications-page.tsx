import { StatusBar } from '@/components/pages/application-tracker/applications/status-bar';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { useState } from 'react';

export const ApplicationsPage = () => {
  const [filter, setFilter] = useState({});
  return (
    <div className="w-full h-full p-10">
      <StatusBar setFilter={setFilter} />
      <ApplicationsContainer filter={filter} />
    </div>
  );
};
