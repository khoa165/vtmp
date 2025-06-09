import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { sortBy } from 'remeda';

import { CompanyLogo } from '@/components/layout/company-logo';
import { getSummaryData } from '@/fetch-data/summary';
import { useOffersData } from '@/hooks/useOffersData';
import { useSummaryData } from '@/hooks/useSummaryData';
import { CompanyMetadataWithOffers } from '@/types';

export const SummaryContainer = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummaryData,
  });

  const populatedData = useOffersData();
  const sortedData = useMemo(
    () =>
      sortBy(
        Object.values(populatedData),
        [(d: CompanyMetadataWithOffers) => d.offersCountTotal, 'desc'],
        [(d: CompanyMetadataWithOffers) => (d.isPartTimeOffer ? 1 : 0), 'asc'],
        [(d: CompanyMetadataWithOffers) => d.displayName.toLowerCase(), 'asc']
      ),
    [populatedData]
  );

  const summaryData = useSummaryData();

  if (isLoading) {
    console.log('Loading summary data...');
  }

  if (isError) {
    console.error('Error fetching summary data:', error);
  }

  return (
    <div id="summary-container" className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-2 sm:px-4 lg:px-8">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 items-start">
            {sortedData.map((company) => (
              <div key={company.displayName} className="w-full">
                <CompanyLogo company={company} maxHeight={84} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-5">
          <div className="summary-right-panel p-6 rounded-2xl">
            <div className="left">
              <h4>
                <span>{data?.conversations ?? 1}</span>conversation back in 2022
              </h4>
              <h4>
                <span>{data?.snapInterns ?? 2}</span>Snap interns with a vision
              </h4>
              <h4>
                <span>{data?.months ?? 3}</span>months of wondering
              </h4>
              <h4>
                <span>{data?.believers ?? 4}</span>believers joining forces
              </h4>
              <hr />
            </div>
            <div className="right">
              <h4>
                we reviewed{' '}
                <span>{data?.reviewedApplications ?? 799} applications</span>
              </h4>
              <h4>
                we interviewed{' '}
                <span>{data?.interviewedCandidates ?? 122} candidates</span>
              </h4>
              <h4>
                we assembled{' '}
                <span>{summaryData.mentorsCount ?? 12} mentors</span>
              </h4>
              <h4>
                we recruited{' '}
                <span>{summaryData.menteesCount ?? 63} mentees</span>
              </h4>
              <hr />
            </div>
            <div className="left">
              <h4>
                <span>{data?.workshops ?? 21}</span>workshops
              </h4>
              <h4>
                <span>{data?.amas ?? 14}</span>AMAs
              </h4>
              <h4>
                <span>{data?.groupProjects ?? 10}</span>group projects
              </h4>
              <h4>
                <span>{data?.leetcodeContests ?? 41}</span>Leetcode contests
              </h4>
              <hr />
            </div>
            <div className="right">
              <h4>
                we hustled
                <span>{summaryData.invitationsCount} invitations</span>
              </h4>
              <h4>
                we prepared<span>{summaryData.interviewsCount} interviews</span>
              </h4>
              <h4>
                we achieved<span>{summaryData.offersCount} offers</span>
              </h4>
              <h4>
                we collected<span>{summaryData.logosCount} logos</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
