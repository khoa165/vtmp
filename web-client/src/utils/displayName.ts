import { MentorshipGroup, MentorshipRole, PeopleSortColumn } from './constants';

export const groupDisplayName: {
  [key in MentorshipGroup]: string;
} = {
  [MentorshipGroup.ORGANIZER]: 'Organizers',
  [MentorshipGroup.PARTICIPANT]: 'Participants',
};

export const roleDisplayName: {
  [key in MentorshipRole]: string;
} = {
  [MentorshipRole.PROGRAM_LEAD]: 'Program Lead',
  [MentorshipRole.PROGRAM_MANAGER]: 'Program Manager',
  [MentorshipRole.PROGRAM_FOUNDER]: 'Program Founder',
  [MentorshipRole.PROGRAM_ADVISOR]: 'Program Advisor',
  [MentorshipRole.LEAD]: 'Lead',
  [MentorshipRole.MENTOR]: 'Mentor',
  [MentorshipRole.EXMENTEE_MENTOR]: 'Mentor (Ex-Mentee)',
  [MentorshipRole.MENTEE]: 'Mentee',
};

export const peopleSortColumnDisplayName: {
  [key in PeopleSortColumn]: string;
} = {
  [PeopleSortColumn.NAME]: 'Name',
  [PeopleSortColumn.OFFERS_COUNT]: 'Offers Count',
  [PeopleSortColumn.ROLE]: 'Role',
};
