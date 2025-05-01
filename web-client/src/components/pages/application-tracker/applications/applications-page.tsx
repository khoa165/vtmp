import { StatusBar } from '@/components/pages/application-tracker/applications/status-bar';
import { ApplicationsContainer } from '@/components/pages/application-tracker/applications/applications-containter';

export const ApplicationsPage = () => {
  return (
    <div className="w-full h-full container p-10">
      <StatusBar />
      <ApplicationsContainer />
    </div>
  );
};
