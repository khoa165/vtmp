import { ApplicationStatusContainer } from '@/components/pages/application-tracker/applications/application-status-container';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';
import { ApplicationStatus } from '@vtmp/common/constants';
import { useState } from 'react';

export interface ApplicationsFilter {
  status?: ApplicationStatus;
}

export const ApplicationsPage = () => {
  const [applicationFilter, setApplicationFilter] =
    useState<ApplicationsFilter>({});
  return (
    <div className="w-full h-full p-10">
      <ApplicationStatusContainer setApplicationFilter={setApplicationFilter} />
      <ApplicationsContainer applicationFilter={applicationFilter} />
    </div>
  );
};
