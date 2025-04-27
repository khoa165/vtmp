import {
  Payment,
  columns,
} from '@/components/pages/application-tracker/applications/columns';
import { DataTable } from '@/components/pages/application-tracker/applications/data-table';
import { getApplicationsData } from '@/components/pages/application-tracker/applications/queries';

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'mai@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'mo@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'minh@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'son@example.com',
    },
  ];
}

export const ApplicationsContainer = () => {
  const data = getData();
  getApplicationsData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
