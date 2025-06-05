import { mentorshipPeople } from '../data/people';
import { rolePriority } from './constants';
import { map, first } from 'remeda';
import { MentorshipOffer, MentorshipPerson } from '@/types';
import { groupDisplayName, roleDisplayName } from './displayName';
import {
  MentorshipGroup,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from '@vtmp/common/constants';

export const getName = (alias: string): string => mentorshipPeople[alias].name;

export const getAvatar = (alias: string): string =>
  mentorshipPeople[alias].avatar;

export const getRoleDisplayName = (role: MentorshipRole): string =>
  roleDisplayName[role];

export const getRolePriority = (role: MentorshipRole): number =>
  rolePriority[role];

export const isMenteeRole = (roles: MentorshipRole[]): boolean =>
  roles.includes(MentorshipRole.SWE_MENTEE);

export const isOrganizerRole = (roles: MentorshipRole[]): boolean =>
  !roles.includes(MentorshipRole.SWE_MENTEE);

export const isHiddenRole = (
  role: MentorshipRole,
  roles: MentorshipRole[]
): boolean =>
  role === MentorshipRole.PROGRAM_FOUNDER ||
  (role === MentorshipRole.SWE_LEAD &&
    roles.includes(MentorshipRole.PROGRAM_LEAD));

export const getGroupDisplayName = (group: MentorshipGroup): string =>
  groupDisplayName[group];

export const isParticipantGroup = (group: MentorshipGroup): boolean =>
  group === MentorshipGroup.PARTICIPANT;

export const isOrganizerGroup = (group: MentorshipGroup): boolean =>
  group === MentorshipGroup.ORGANIZER;

export const isPersonInCorrectGroup = (
  roles: MentorshipRole[],
  group: MentorshipGroup
) =>
  (isMenteeRole(roles) && isParticipantGroup(group)) ||
  (isOrganizerRole(roles) && isOrganizerGroup(group));

export const getTerm = (person: MentorshipPerson, year: number) =>
  person.terms.find((t) => t.year === year);

const isMentorSubsetRole = (person: MentorshipPerson, year: number) =>
  Boolean(
    getTerm(person, year)?.roles?.includes(MentorshipRole.SWE_EXMENTEE_MENTOR)
  ) ||
  Boolean(
    getTerm(person, year)?.roles?.includes(
      MentorshipRole.SWE_EXMENTEE_LOGISTICS_SUPPORT
    )
  ) ||
  Boolean(
    getTerm(person, year)?.roles?.includes(
      MentorshipRole.SWE_EXMENTEE_INACTIVE_MENTOR
    )
  );
const isLeadSubsetRole = (person: MentorshipPerson, year: number) =>
  Boolean(
    getTerm(person, year)?.roles?.includes(MentorshipRole.SWE_RISING_LEAD)
  ) ||
  Boolean(
    getTerm(person, year)?.roles?.includes(MentorshipRole.SWE_INACTIVE_LEAD)
  );

const isProgramManager = (person: MentorshipPerson, year: number) =>
  Boolean(getTerm(person, year)?.roles?.includes(MentorshipRole.PROGRAM_LEAD));

export const doesPersonHaveRoleInYear = (
  person: MentorshipPerson,
  role: MentorshipRole,
  year: number
) =>
  Boolean(getTerm(person, year)?.roles?.includes(role)) ||
  (role === MentorshipRole.SWE_MENTOR && isMentorSubsetRole(person, year)) ||
  (role === MentorshipRole.SWE_LEAD && isLeadSubsetRole(person, year)) ||
  (role === MentorshipRole.SWE_PROGRAM_LEAD && isProgramManager(person, year));

export const doesPersonHaveAtLeastOneRoleInYear = (
  person: MentorshipPerson,
  roles: MentorshipRole[],
  year: number
) => roles.some((role) => doesPersonHaveRoleInYear(person, role, year));

const isInternshipOffer = (offer: MentorshipOffer) =>
  offer.type === OfferType.INTERNSHIP;

export const isNewGradOffer = (offer: MentorshipOffer) =>
  offer.type === OfferType.NEW_GRAD;

export const isReturnOfferForInternship = (offer: MentorshipOffer) =>
  isInternshipOffer(offer) && offer.channel === OfferChannel.RETURN_OFFER;

export const isReturnOfferForNewGrad = (offer: MentorshipOffer) =>
  isNewGradOffer(offer) && offer.channel === OfferChannel.RETURN_OFFER;

export const getPersonPriorityInYear = (
  person: MentorshipPerson,
  year: number
): number => {
  const roles = getTerm(person, year)?.roles ?? [];
  const priorities = map(roles, getRolePriority);
  return first(priorities.sort((a, b) => a - b)) ?? 5;
};

export const DEFAULT_ROLES = [
  MentorshipRole.SWE_PROGRAM_LEAD,
  MentorshipRole.PROGRAM_ADVISOR,
  MentorshipRole.SWE_LEAD,
  MentorshipRole.SWE_MENTOR,
  MentorshipRole.SWE_MENTEE,
  MentorshipRole.PD_MENTOR,
  MentorshipRole.PD_MENTEE,
];
