import React from 'react';
import { Col, Row } from 'reactstrap';
import { PeopleCard } from 'src/components/people/people-card';
import { CompanyMetadataWithOffers, MentorshipPerson } from 'src/types';
import { PeopleSortColumn } from 'src/utils/constants';

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
