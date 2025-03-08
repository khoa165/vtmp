import { MentorshipGroup, MentorshipRole, PeopleSortColumn } from './constants';

export const groupDisplayName: Record<MentorshipGroup, string> = {
  [MentorshipGroup.ORGANIZER]: 'Organizers',
  [MentorshipGroup.PARTICIPANT]: 'Participants',
};

export const roleDisplayName: Record<MentorshipRole, string> = {
  [MentorshipRole.SWE_PROGRAM_LEAD]: 'SWE Program Lead',
  [MentorshipRole.PROGRAM_MANAGER]: 'Program Manager',
  [MentorshipRole.PROGRAM_FOUNDER]: 'Program Founder',
  [MentorshipRole.PROGRAM_ADVISOR]: 'Program Advisor',
  [MentorshipRole.SWE_RISING_LEAD]: 'SWE Lead',
  [MentorshipRole.SWE_LEAD]: 'SWE Lead',
  [MentorshipRole.SWE_INACTIVE_LEAD]: 'SWE Lead',
  [MentorshipRole.SWE_MENTOR]: 'SWE Mentor',
  [MentorshipRole.PD_MENTOR]: 'PD Mentor',
  [MentorshipRole.SWE_EXMENTEE_MENTOR]: 'SWE Mentor (Ex-Mentee)',
  [MentorshipRole.SWE_EXMENTEE_INACTIVE_MENTOR]: 'SWE Mentor (Ex-Mentee)',
  [MentorshipRole.SWE_EXMENTEE_LOGISTICS_SUPPORT]:
    'SWE Logistics Support (Ex-Mentee)',
  [MentorshipRole.SWE_MENTEE]: 'SWE Mentee',
  [MentorshipRole.PD_MENTEE]: 'PD Mentee',
};

export const peopleSortColumnDisplayName: Record<PeopleSortColumn, string> = {
  [PeopleSortColumn.NAME]: 'Name',
  [PeopleSortColumn.OFFERS_COUNT]: 'Offers Count',
  [PeopleSortColumn.ROLE]: 'Role',
};
