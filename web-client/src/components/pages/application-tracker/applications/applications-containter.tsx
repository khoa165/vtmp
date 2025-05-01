import { applicationColumns } from '@/components/pages/application-tracker/applications/application-columns';
import { DataTable } from '@/components/pages/application-tracker/applications/data-table';
import { ApplicationsResponseSchema } from '@/components/pages/application-tracker/applications/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const ApplicationsContainer = (): React.JSX.Element | null => {
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: applicationsData,
    error,
  } = useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS], // todo-Son: use something more dynamic here
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

  const { mutate: deleteApplicationFn } = useMutation({
    mutationFn: (applicationId: string) =>
      request(Method.DELETE, `/applications/${applicationId}`, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_APPLICATIONS] });
    },
    onError: (error) => {
      console.log('Error in useMutation deleting application:', error);
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
    <div>
      <DataTable
        columns={applicationColumns(deleteApplicationFn)}
        data={applicationsData}
      />
    </div>
  );
};
