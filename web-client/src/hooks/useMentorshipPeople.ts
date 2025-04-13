import { useMemo } from 'react';
import {
  doesPersonHaveAtLeastOneRoleInYear,
  getPersonPriorityInYear,
} from 'src/utils/data';
import { PeopleSortColumn } from 'src/utils/constants';
import { mentorshipPeople } from 'src/data/people';
import { sortBy } from 'lodash';
import { MentorshipRole } from '@common/enums';

export const useMentorshipPeople = (
  year: number,
  sortColumn: PeopleSortColumn,
  sortDescending: boolean,
  filteredRoles: MentorshipRole[]
) => {
  const roles = useMemo(() => {
    if (filteredRoles.length === 0) {
      const filteredRoles = [
        MentorshipRole.PROGRAM_ADVISOR,
        MentorshipRole.SWE_PROGRAM_LEAD,
        MentorshipRole.SWE_LEAD,
        MentorshipRole.SWE_MENTOR,
        MentorshipRole.SWE_MENTEE,
        MentorshipRole.PD_MENTOR,
        MentorshipRole.PD_MENTEE,
      ];
      return filteredRoles;
    }
    return filteredRoles;
  }, [filteredRoles]);

  const people = useMemo(() => {
    const filteredPeople = Object.values(mentorshipPeople).filter((p) =>
      doesPersonHaveAtLeastOneRoleInYear(p, roles, year)
    );
    let sortedPeople = filteredPeople;
    if (sortColumn === PeopleSortColumn.NAME) {
      sortedPeople = sortBy(filteredPeople, (p) => p.name);
    } else if (sortColumn === PeopleSortColumn.OFFERS_COUNT) {
      sortedPeople = sortBy(
        filteredPeople,
        (p) => {
          const currentTerm = p.terms.find((t) => t.year === year);
          return currentTerm?.offers?.length ?? 0;
        },
        (p) => getPersonPriorityInYear(p, year),
        (p) => p.name
      );
    } else if (sortColumn === PeopleSortColumn.ROLE) {
      sortedPeople = sortBy(
        filteredPeople,
        (p) => getPersonPriorityInYear(p, year),
        (p) => p.name
      );
    }
    return sortDescending ? sortedPeople.reverse() : sortedPeople;
  }, [roles, year, sortColumn, sortDescending]);

  return people;
};
