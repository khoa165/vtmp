import React, { Fragment } from 'react';
import { Avatar } from '@/components/layout/avatar';
import { chunk } from 'remeda';
import { CompanyMetadataWithOffers, MentorshipOffer } from '@/types';
import {
  isNewGradOffer,
  isReturnOfferForInternship,
  isReturnOfferForNewGrad,
} from '@/utils/data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/base/tooltip';

interface MiniCompaniesListProps {
  offersList: MentorshipOffer[];
  companiesMetadata: Record<string, CompanyMetadataWithOffers>;
}

export const MiniCompaniesList: React.FC<MiniCompaniesListProps> = ({
  offersList,
  companiesMetadata,
}) => {
  const getOfferDisplay = (
    offer: MentorshipOffer,
    companiesMetadata: Record<string, CompanyMetadataWithOffers>
  ) => {
    const name = companiesMetadata[offer.name].displayName;
    if (isReturnOfferForNewGrad(offer)) {
      return `${name} (return new grad)`;
    } else if (isReturnOfferForInternship(offer)) {
      return `${name} (return internship)`;
    } else if (isNewGradOffer(offer)) {
      return `${name} (new grad)`;
    }
    return name;
  };

  return chunk(offersList, 2).map((ol, index) => (
    <div key={index} className="flex gap-x-2">
      {ol.map((o) => (
        <Fragment key={o.name}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Avatar
                    url={companiesMetadata[o.name].logoUrl}
                    alt={`Logo of ${companiesMetadata[o.name].displayName}`}
                    size="tiny"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {getOfferDisplay(o, companiesMetadata)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Fragment>
      ))}
    </div>
  ));
};
