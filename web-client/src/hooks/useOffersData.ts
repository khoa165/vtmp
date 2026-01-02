import { useMemo } from 'react';

// import { OfferChannel } from '@vtmp/common/constants';
import { mentorshipPeople, offerCompanies } from '@vtmp/common/people';

import { CompanyMetadataWithOffers } from '#vtmp/web-client/types';

const placeholderLogoUrl = '';

export const useOffersData = () => {
  return useMemo(() => {
    const data: Record<string, CompanyMetadataWithOffers> = {};
    Object.keys(offerCompanies).forEach((company) => {
      data[company] = {
        ...offerCompanies[company],
        logoUrl:
          placeholderLogoUrl ||
          'https://res.cloudinary.com/khoa165/image/upload/c_fit,h_200,w_200/v1767340326/viettech/logos/vtmp-' +
            offerCompanies[company].logoFilename,
        offersCountTotal: 0,
        offersCountByYear: {
          2023: 0,
          2024: 0,
          2025: 0,
        },
      };
    });
    Object.values(mentorshipPeople).forEach((person) => {
      person.terms?.forEach((term) => {
        term.offers?.forEach((offer) => {
          // if (offer.channel === OfferChannel.RETURN_OFFER) {
          //   return;
          // }
          if (offer.name in data) {
            data[offer.name].offersCountByYear[term.year] += 1;
            data[offer.name].offersCountTotal += 1;
          }
        });
      });
    });
    // const offers =
    //   Object.values(mentorshipPeople).flatMap((person) =>
    //     person.terms?.flatMap((term) => term.offers ?? [])
    //   ) ?? [];
    // console.log(sortBy(offers, (o) => new Date(o.date)));
    return data;
  }, []);
};
