import { StatusBar } from '@/components/pages/application-tracker/applications/status-bar';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';

export const ApplicationsPage = () => {
  return (
    <div>
      <StatusBar />
      <ApplicationsContainer />
    </div>
  );
};
