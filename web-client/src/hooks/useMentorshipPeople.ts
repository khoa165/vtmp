import { useMemo, useState } from 'react';
import {
  doesPersonHaveAtLeastOneRoleInYear,
  getPersonPriorityInYear,
} from 'utils/data';
import { MentorshipRole, PeopleSortColumn } from 'utils/constants';
import { mentorshipPeople } from 'data/people';
import { sortBy } from 'lodash';

export const useMentorshipPeople = (
  year: number,
  sortColumn: PeopleSortColumn,
  sortDescending: boolean
) => {
  const [selectedRoles, setSelectedRoles] = useState<MentorshipRole[]>([]);
  const roles = useMemo(() => {
    if (selectedRoles.length === 0) {
      const filteredRoles = [
        MentorshipRole.PROGRAM_ADVISOR,
        MentorshipRole.SWE_PROGRAM_LEAD,
        MentorshipRole.SWE_LEAD,
        MentorshipRole.SWE_MENTOR,
        MentorshipRole.SWE_MENTEE,
      ];
      return filteredRoles;
    }
    return selectedRoles;
  }, [selectedRoles]);

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

  return { people, setSelectedRoles };
};
