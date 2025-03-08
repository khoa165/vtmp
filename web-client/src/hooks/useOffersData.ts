import { mentorshipPeople } from 'data/people';
import { offerCompanies } from 'data/companies';
import { useMemo } from 'react';
import { CompanyMetadataWithOffers } from 'types';
// import { sortBy } from 'lodash';

export const useOffersData = () => {
  return useMemo(() => {
    const data: { [key: string]: CompanyMetadataWithOffers } = {};
    Object.keys(offerCompanies).forEach((company) => {
      data[company] = {
        ...offerCompanies[company],
        logoUrl:
          'https://res.cloudinary.com/khoa165/image/upload/c_fit,h_200,w_200/v1740104770/viettech/logos/vtmp-' +
          offerCompanies[company].logoFilename,
        offersCountTotal: 0,
        offersCountByYear: {
          2023: 0,
          2024: 0,
        },
      };
    });
    Object.values(mentorshipPeople).forEach((person) => {
      person.terms?.forEach((term) => {
        term.offers?.forEach((offer) => {
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
