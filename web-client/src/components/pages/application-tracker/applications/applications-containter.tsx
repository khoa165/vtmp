import { ApplicationCard } from '@/components/pages/application-tracker/applications/application-card';
import {
  // Payment,
  columns,
} from '@/components/pages/application-tracker/applications/columns';
import { DataTable } from '@/components/pages/application-tracker/applications/data-table';
import { getApplicationsData } from '@/components/pages/application-tracker/applications/queries';
import { QueryKey } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';

// function getData(): Payment[] {
//   // Fetch data from your API here.
//   return [
//     {
//       id: '728ed52f',
//       amount: 100,
//       status: 'pending',
//       email: 'mai@example.com',
//     },
//     {
//       id: '728ed52f',
//       amount: 100,
//       status: 'pending',
//       email: 'mo@example.com',
//     },
//   ];
// }

export const ApplicationsContainer = () => {
  // const data = getData();
  const {
    isLoading,
    isError,
    data: applicationsData,
    error,
  } = useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS],
    queryFn: getApplicationsData,
  });

  if (isLoading) {
    console.log('Loading summary data...');
    // return <span>Loading summary data...</span>;
  }

  if (isError) {
    console.error('Error fetching summary data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load summary data.'}</span>
    // );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={applicationsData ?? []} />
      {applicationsData?.map((application) => {
        return (
          <ApplicationCard
            key={application._id}
            jobPostingId={application.jobPostingId}
            userId={application.userId}
            status={application.status}
          ></ApplicationCard>
        );
      })}
    </div>
  );
};
