import { Card } from '@/components/base/card';
import {
  useGetJobPostings,
  useGetJobPostingsInADay,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { ExternalLink } from 'lucide-react';

export const JobPostingStatusCards = (): React.JSX.Element | null => {
  const navigate = useNavigatePreserveQueryParams();
  const linkSubmitClick = () => {
    navigate('/link-sharing');
  };
  const {
    isLoading: isLoadingInADay,
    isError: isErrorInADay,
    error: errorInADay,
    data: JobPostingInADay,
  } = useGetJobPostingsInADay();

  const {
    isLoading: isLoadingNotApplied,
    isError: isErrorNotApplied,
    error: errorNotApplied,
    data: JobPostingNotApplied,
  } = useGetJobPostings();

  if (isLoadingInADay || isLoadingNotApplied) {
    console.log('Job postings data loading...');
    return <span>Loading job postings data...</span>;
  }

  if (isErrorInADay || isErrorNotApplied) {
    console.error(
      'Error fetching job postings:',
      errorInADay || errorNotApplied
    );
    return (
      <span>
        Error:{' '}
        {(errorInADay?.message || errorNotApplied?.message) ??
          'Failed to load data.'}
      </span>
    );
  }

  return (
    <div
      className={`grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6 mt-3`}
    >
      <Card className={`bg-transparent h-fit transition-colors duration-200`}>
        <section className="flex flex-col items-left justify-center ml-10">
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold max-lg:text-[0.7rem] text-wrap">
              New job postings
            </span>
          </div>
          <div className="text-[2rem] max-lg:text-[1rem] font-bold">
            {JobPostingInADay?.length}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="max-lg:text-[0.7rem] text-wrap">
              Last 24h hours
            </span>
          </div>
        </section>
      </Card>
      <Card className={`bg-transparent h-fit transition-colors duration-200`}>
        <section className="flex flex-col items-left justify-center ml-10">
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold max-lg:text-[0.7rem] text-wrap">
              Total job postings
            </span>
          </div>
          <div className="text-[2rem] max-lg:text-[1rem] font-bold">
            {JobPostingNotApplied?.length}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span
              className=" max-lg:text-[0.7rem] text-wrap underline cursor-pointer inline-flex items-center gap-1"
              onClick={() => linkSubmitClick()}
            >
              Share a Job Link <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </section>
      </Card>
    </div>
  );
};
