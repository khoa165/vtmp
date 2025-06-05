import { Card } from '@/components/base/card';
import { Skeleton } from '@/components/base/skeleton';
import {
  useGetJobPostings,
  useGetJobPostingsInADay,
} from '@/components/pages/application-tracker/job-postings/hooks/job-postings';
import { useNavigatePreserveQueryParams } from '@/hooks/useNavigatePreserveQueryParams';
import { ExternalLink } from 'lucide-react';
import { CustomError } from '@/utils/errors';

export const JobPostingStatusCards = (): React.JSX.Element | null => {
  const navigate = useNavigatePreserveQueryParams();

  const {
    isLoading: isLoadingInADay,
    error: errorInADay,
    data: jobPostingsInADay,
  } = useGetJobPostingsInADay();

  const {
    isLoading: isLoadingNotApplied,
    error: errorNotApplied,
    data: jobPostingsNotApplied,
  } = useGetJobPostings();

  if (isLoadingInADay || isLoadingNotApplied) {
    return (
      <div className="grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6 mt-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (errorInADay || errorNotApplied) {
    throw new CustomError('Error fetching job postings data');
  }

  return (
    <div className="grid grid-cols-5 w-full gap-4 mb-6 max-md:grid-rows-6 mt-3">
      <Card className="bg-transparent h-fit transition-colors duration-200">
        <section className="flex flex-col items-left justify-center ml-10">
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold max-lg:text-[0.7rem] text-wrap">
              New job postings
            </span>
          </div>
          <div className="text-[2rem] max-lg:text-[1rem] font-bold">
            {jobPostingsInADay?.length ?? 0}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="max-lg:text-[0.7rem] text-wrap">
              Last 24h hours
            </span>
          </div>
        </section>
      </Card>

      <Card className="bg-transparent h-fit transition-colors duration-200">
        <section className="flex flex-col items-left justify-center ml-10">
          <div className="flex flex-row items-center gap-2">
            <span className="font-bold max-lg:text-[0.7rem] text-wrap">
              Total job postings
            </span>
          </div>
          <div className="text-[2rem] max-lg:text-[1rem] font-bold">
            {jobPostingsNotApplied?.length ?? 0}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span
              className="max-lg:text-[0.7rem] text-wrap underline cursor-pointer inline-flex items-center gap-1"
              onClick={() => navigate('/link-sharing')}
            >
              Share a Job Link <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </section>
      </Card>
    </div>
  );
};
