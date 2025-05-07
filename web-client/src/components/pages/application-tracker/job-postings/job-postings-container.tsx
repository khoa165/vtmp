import { useGetJobPostings } from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { JobPostingsTable } from '@/components/pages/application-tracker/job-postings/job-postings-table';
import { jobPostingsTableColumns } from '@/components/pages/application-tracker/job-postings/job-postings-table-columns';

export const JobPostingsContainer = (): React.JSX.Element | null => {
  const {
    isLoading,
    isError,
    error,
    data: jobPostingsData,
  } = useGetJobPostings();

  if (isLoading) {
    // TODO-(QuangMinhNguyen27405): Remove this console log in production and add a loading spinner
    console.log('Loading job postings data...');
    return <span>Loading job postings...</span>;
  }

  if (isError) {
    // TODO-(QuangMinhNguyen27405): Remove this console log and add a toast error message
    console.error('Error fetching job postings data:', error);
    return null;
  }

  if (!jobPostingsData || jobPostingsData.length === 0) {
    // TODO-(QuangMinhNguyen27405): Replace `return null` with an empty state message or component
    return null;
  }

  return (
    <JobPostingsTable
      columns={jobPostingsTableColumns()}
      data={jobPostingsData}
    />
  );
};
