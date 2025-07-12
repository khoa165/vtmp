import React from 'react';

import { PeopleCard } from '#vtmp/web-client/components/people/people-card';
import {
  CompanyMetadataWithOffers,
  MentorshipPerson,
} from '#vtmp/web-client/types';
import { PeopleSortColumn } from '#vtmp/web-client/utils/constants';

interface PeopleGridProps {
  year: number | 'all';
  people: MentorshipPerson[];
  companiesMetadata: Record<string, CompanyMetadataWithOffers>;
  sortColumn: PeopleSortColumn;
}

export const PeopleGrid: React.FC<PeopleGridProps> = ({
  people,
  year,
  companiesMetadata,
  sortColumn,
}) => {
  if (people.length === 0) {
    return (
      <h3 className="mt-3 text-center text-green">
        Adjust your filters to see results! Otherwise, check back later for
        updates once we recruit.
      </h3>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 lg:gap-y-0">
      {people.map((person) => (
        <div key={person.alias}>
          <PeopleCard
            year={year}
            person={person}
            className="people-card"
            companiesMetadata={companiesMetadata}
            sortColumn={sortColumn}
          />
        </div>
      ))}
    </div>
  );
};
