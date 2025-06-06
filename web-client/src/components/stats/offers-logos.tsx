import { useMemo } from 'react';
import { useOffersData } from '@/hooks/useOffersData';
import { sortBy } from 'remeda';
import { CompanyLogo } from '@/components/layout/company-logo';
import { CompanyMetadataWithOffers } from '@/types';

export const OfferLogos = () => {
  const populatedData = useOffersData();
  const data = useMemo(
    () =>
      sortBy(
        Object.values(populatedData),
        [(d: CompanyMetadataWithOffers) => d.offersCountTotal, 'desc'],
        [(d: CompanyMetadataWithOffers) => d.displayName.toLowerCase(), 'asc']
      ),
    [populatedData]
  );

  return (
    <div
      id="companies-logo-canvas"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 items-start"
    >
      {data.map((company) => (
        <div key={company.displayName}>
          <CompanyLogo company={company} />
        </div>
      ))}
    </div>
  );
};
