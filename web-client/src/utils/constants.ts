import { InterviewType, MentorshipRole } from '@common/enums';

export const rolePriority: Record<MentorshipRole, number> = {
  [MentorshipRole.SWE_PROGRAM_LEAD]: 1.0,
  [MentorshipRole.PROGRAM_MANAGER]: 1.1,
  [MentorshipRole.PROGRAM_FOUNDER]: 1.2,
  [MentorshipRole.PROGRAM_ADVISOR]: 1.3,
  [MentorshipRole.SWE_RISING_LEAD]: 2,
  [MentorshipRole.SWE_LEAD]: 2.1,
  [MentorshipRole.SWE_INACTIVE_LEAD]: 2.2,
  [MentorshipRole.PD_MENTOR]: 3,
  [MentorshipRole.SWE_MENTOR]: 3.1,
  [MentorshipRole.SWE_EXMENTEE_MENTOR]: 3.1,
  [MentorshipRole.SWE_EXMENTEE_INACTIVE_MENTOR]: 3.2,
  [MentorshipRole.SWE_EXMENTEE_LOGISTICS_SUPPORT]: 3.3,
  [MentorshipRole.PD_MENTEE]: 4,
  [MentorshipRole.SWE_MENTEE]: 4.1,
};

export enum MentorshipYear {
  YEAR_2023 = 'YEAR_2023',
  YEAR_2024 = 'YEAR_2024',
  YEAR_2025 = 'YEAR_2025',
}

export const yearDisplay: Record<MentorshipYear, number> = {
  [MentorshipYear.YEAR_2023]: 2023,
  [MentorshipYear.YEAR_2024]: 2024,
  [MentorshipYear.YEAR_2025]: 2025,
};

export enum StatsType {
  OFFERS = 'offers',
  INTERVIEWS = 'interviews',
  TIMELINE = 'timeline',
  LOGOS = 'logos',
}

export const interviewTypeAbbreviation: Record<InterviewType, string> = {
  [InterviewType.TECHNICAL_LC_CODING]: 'T',
  [InterviewType.OVERALL_BEHAVIORAL]: 'B',
  [InterviewType.PROJECT_WALKTHROUGH]: 'W',
  [InterviewType.SYSTEM_DESIGN]: 'S',
  [InterviewType.RECRUITER_SCREEN]: 'R',
  [InterviewType.HIRING_MANAGER]: 'H',
  [InterviewType.TRIVIA_CONCEPT]: 'V',
  [InterviewType.PRACTICAL_CODING]: 'P',
  [InterviewType.DEBUGGING]: 'D',
  [InterviewType.CRITICAL_THINKING]: 'C',
  [InterviewType.CODE_REVIEW]: 'O',
};

export enum PeopleSortColumn {
  NAME = 'NAME',
  OFFERS_COUNT = 'OFFERS_COUNT',
  ROLE = 'ROLE',
}
