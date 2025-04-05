import React, { Fragment } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { CompanyMetadataWithOffers, MentorshipOffer } from 'src/types';
import { Avatar } from 'src/components/layout/avatar';
import { chunk } from 'lodash';
import {
  isReturnOfferForNewGrad,
  isReturnOfferForInternship,
  isNewGradOffer,
} from 'src/utils/data';

interface MiniCompaniesListProps {
  offersList: MentorshipOffer[];
  prefix: string;
  companiesMetadata: Record<string, CompanyMetadataWithOffers>;
}
export const MiniCompaniesList: React.FC<MiniCompaniesListProps> = ({
  offersList,
  prefix,
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
    <div key={index} className="offers-row-wrapper">
      {ol.map((o) => (
        <Fragment key={o.name}>
          <Avatar
            url={companiesMetadata[o.name].logoUrl}
            id={`${prefix}-${o.name}`}
            alt={`Logo of ${companiesMetadata[o.name].displayName}`}
            size="tiny"
          />
          <UncontrolledTooltip
            placement="bottom"
            target={`${prefix}-${o.name}`}
          >
            {getOfferDisplay(o, companiesMetadata)}
          </UncontrolledTooltip>
        </Fragment>
      ))}
    </div>
  ));
};
