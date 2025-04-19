import { useMemo } from 'react';
import {
  doesPersonHaveAtLeastOneRoleInYear,
  getPersonPriorityInYear,
} from 'src/utils/data';
import { PeopleSortColumn } from 'src/utils/constants';
import { mentorshipPeople } from 'src/data/people';
import { sortBy, sumBy } from 'lodash';
import * as R from 'remeda';
import { MentorshipRole } from '@common/enums';

export const useMentorshipPeople = (
  year: number | 'all',
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
    let filteredPeople = Object.values(mentorshipPeople);
    if (year !== 'all') {
      filteredPeople = Object.values(mentorshipPeople).filter((p) =>
        doesPersonHaveAtLeastOneRoleInYear(p, roles, year)
      );
    }
    let sortedPeople = filteredPeople;
    if (sortColumn === PeopleSortColumn.NAME) {
      sortedPeople = sortBy(filteredPeople, (p) => p.name);
      return sortDescending ? sortedPeople.reverse() : sortedPeople;
    } else if (sortColumn === PeopleSortColumn.OFFERS_COUNT) {
      sortedPeople = sortBy(
        filteredPeople,
        (p) => {
          if (year === 'all') {
            return sumBy(p.terms, (t) => t.offers?.length ?? 0);
          } else {
            const currentTerm = p.terms.find((t) => t.year === year);
            return currentTerm?.offers?.length ?? 0;
          }
        },
        (p) => p.name
      );
      return sortDescending ? sortedPeople.reverse() : sortedPeople;
    } else if (sortColumn === PeopleSortColumn.ROLE) {
      sortedPeople = sortBy(
        filteredPeople,
        (p) => {
          if (year === 'all') {
            const priorityByTerm = p.terms.map((t) =>
              getPersonPriorityInYear(p, t.year)
            );
            const highestPriority = R.firstBy(priorityByTerm, R.identity());
            if (!highestPriority) {
              return 1000;
            }
            return highestPriority;
          } else {
            return getPersonPriorityInYear(p, year);
          }
        },
        (p) => p.name
      );
    }
    return sortedPeople;
  }, [roles, year, sortColumn, sortDescending]);

  return people;
};
