import {
  MentorshipGroup,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from 'utils/constants';
import { mentorshipPeople } from '../data/people';
import { rolePriority } from './constants';
import { min } from 'lodash';
import { MentorshipOffer, MentorshipPerson } from 'types';
import { groupDisplayName, roleDisplayName } from './displayName';

export const getName = (alias: string): string => mentorshipPeople[alias].name;

export const getAvatar = (alias: string): string =>
  mentorshipPeople[alias].avatar;

export const getRoleDisplayName = (role: MentorshipRole): string =>
  roleDisplayName[role];

export const getRolePriority = (role: MentorshipRole): number =>
  rolePriority[role];

export const isMenteeRole = (roles: MentorshipRole[]): boolean =>
  roles.includes(MentorshipRole.MENTEE);

export const isOrganizerRole = (roles: MentorshipRole[]): boolean =>
  !roles.includes(MentorshipRole.MENTEE);

export const isHiddenRole = (
  role: MentorshipRole,
  roles: MentorshipRole[]
): boolean =>
  role === MentorshipRole.PROGRAM_FOUNDER ||
  (role === MentorshipRole.LEAD &&
    roles.includes(MentorshipRole.PROGRAM_MANAGER));

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

const isMentorUsedToBeMentee = (person: MentorshipPerson, year: number) =>
  Boolean(
    getTerm(person, year)?.roles?.includes(MentorshipRole.EXMENTEE_MENTOR)
  );

const isProgramManager = (person: MentorshipPerson, year: number) =>
  Boolean(
    getTerm(person, year)?.roles?.includes(MentorshipRole.PROGRAM_MANAGER)
  );

export const doesPersonHaveRoleInYear = (
  person: MentorshipPerson,
  role: MentorshipRole,
  year: number
) =>
  Boolean(getTerm(person, year)?.roles?.includes(role)) ||
  (role === MentorshipRole.MENTOR && isMentorUsedToBeMentee(person, year)) ||
  (role === MentorshipRole.PROGRAM_LEAD && isProgramManager(person, year));

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
) => min(getTerm(person, year)?.roles.map(getRolePriority)) ?? 5;

export const getFilterRoles = () => [
  MentorshipRole.PROGRAM_LEAD,
  MentorshipRole.PROGRAM_ADVISOR,
  MentorshipRole.LEAD,
  MentorshipRole.MENTOR,
  MentorshipRole.MENTEE,
];
