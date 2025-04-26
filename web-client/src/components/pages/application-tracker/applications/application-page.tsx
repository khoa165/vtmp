import ApplicationTable from '@/components/pages/application-tracker/applications/application-table';
import DashboardHeader from '@/components/pages/application-tracker/applications/dashboard-header';

const ApplicationPage = () => {
  return (
    <div>
      <DashboardHeader />
      <ApplicationTable />
    </div>
  );
};
export default ApplicationPage;
