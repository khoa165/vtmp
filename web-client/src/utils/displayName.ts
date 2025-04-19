import { MentorshipGroup, MentorshipRole } from '@common/enums';
import { PeopleSortColumn, ProjectName } from './constants';

export const groupDisplayName: Record<MentorshipGroup, string> = {
  [MentorshipGroup.ORGANIZER]: 'Organizers',
  [MentorshipGroup.PARTICIPANT]: 'Participants',
};

export const roleDisplayName: Record<MentorshipRole, string> = {
  [MentorshipRole.PROGRAM_LEAD]: 'Program Lead',
  [MentorshipRole.SWE_PROGRAM_LEAD]: 'SWE Program Lead',
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

export const projectDisplayName: Record<ProjectName, string> = {
  [ProjectName.FINANCIAL_APP]: 'Financial App',
  [ProjectName.SAFE_TRAVEL]: 'Safe Travel',
  [ProjectName.PRODUCTIFY]: 'Productify',
  [ProjectName.FLAVORIE]: 'Flavorie',
  [ProjectName.PICK_ME_FOOD]: 'Pick Me Food',
  [ProjectName.GATHERING_GLOBE]: 'Gathering Globe',
  [ProjectName.BONDSCAPE]: 'Bondscape',
  [ProjectName.CUPID]: 'Cupid',
  [ProjectName.PEACE_POD]: 'Peace Pod',
  [ProjectName.TOURIFIC]: 'Tourific',
  [ProjectName.SUBLEAZY]: 'Subleazy',
  [ProjectName.ZERO_KM]: '0km',
  [ProjectName.LOCAL_TASTE]: 'Local Taste',
  [ProjectName.CARE_BEAR]: 'Care Bear',
  [ProjectName.FAIR_SHARE]: 'Fair Share',
  [ProjectName.APPLICATION_TRACKER]: 'Application Tracker',
  [ProjectName.CODE_BUDDY]: 'Code Buddy',
};
