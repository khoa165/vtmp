import { applicationColumns } from '@/components/pages/application-tracker/applications/application-columns';
import { DataTable } from '@/components/pages/application-tracker/applications/data-table';
import { ApplicationsResponseSchema } from '@/components/pages/application-tracker/applications/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';

export const ApplicationsContainer = (): React.JSX.Element | null => {
  const {
    isLoading,
    isError,
    data: applicationsData,
    error,
  } = useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS], // todo-Son: sue something more dynamic here
    queryFn: async () => {
      const response = await request(
        Method.GET,
        '/applications',
        null,
        ApplicationsResponseSchema
      );
      return response.data;
    },
  });

  if (isLoading) {
    console.log('Loading summary data...');
    return <span>Loading summary data...</span>;
  }

  if (isError) {
    console.error('Error fetching summary data:', error);
    // return (
    //   <span>Error: {error.message || 'Failed to load summary data.'}</span>
    // );
    return null;
  }

  if (!applicationsData || applicationsData.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={applicationColumns} data={applicationsData} />
    </div>
  );
};
