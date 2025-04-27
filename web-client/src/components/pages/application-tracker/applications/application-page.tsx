import ApplicationTable from '@/components/pages/application-tracker/applications/application-table';
import DashboardHeader from '@/components/pages/application-tracker/applications/dashboard-header';
import DemoPage from '@/components/pages/application-tracker/applications/page';

export const ApplicationPage = () => {
  return (
    <div>
      <DashboardHeader />
      <ApplicationTable />
      <DemoPage />
    </div>
  );
};
