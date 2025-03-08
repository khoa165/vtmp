import React from 'react';
import { Col, Row } from 'reactstrap';
import { PeopleCard } from 'components/people/people-card';
import { CompanyMetadataWithOffers, MentorshipPerson } from 'types';
import { MentorshipYear, PeopleSortColumn, yearDisplay } from 'utils/constants';
import { max } from 'lodash';

interface PeopleGridProps {
  year: number;
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
  if (
    people.length === 0 &&
    year === max(Object.keys(MentorshipYear).map((y) => yearDisplay[y]))
  ) {
    return (
      <h3 className="mt-3 text-center text-green">
        Adjust your filters to see results! Otherwise, check back later for
        updates once we recruit.
      </h3>
    );
  }

  return (
    <Row className="mt-3">
      {people.map((person) => (
        <Col lg="6" xl="4" key={person.alias}>
          <PeopleCard
            year={year}
            person={person}
            className="people-card"
            companiesMetadata={companiesMetadata}
            sortColumn={sortColumn}
          />
        </Col>
      ))}
    </Row>
  );
};
