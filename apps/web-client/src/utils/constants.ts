import {
  InterviewType,
  MentorshipRole,
  ApplicationStatus,
  InvitationStatus,
  LinkStatus,
  InterviewStatus,
} from '@vtmp/common/constants';

export const rolePriority: Record<MentorshipRole, number> = {
  [MentorshipRole.PROGRAM_LEAD]: 1.0,
  [MentorshipRole.PROGRAM_FOUNDER]: 1.1,
  [MentorshipRole.SWE_PROGRAM_LEAD]: 1.2,
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
  [MentorshipRole.COMMUNITY_MEMBER]: 10,
};

export enum MentorshipYear {
  YEAR_2023 = 'YEAR_2023',
  YEAR_2024 = 'YEAR_2024',
  YEAR_2025 = 'YEAR_2025',
}

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

export enum QueryKey {
  SUBMIT_LINK = '/api/links',
  GET_APPLICATIONS = '/api/applications',
  GET_INVITATIONS = '/api/admin/invitations',
  GET_JOB_POSTINGS = '/api/job-postings/not-applied',
  GET_JOB_POSTINGS_IN_ADAY = '/api/job-postings/not-applied-last-24h',
  GET_APPLICATIONS_COUNT_BY_STATUS = '/api/applications/countByStatus',
  GET_APPLICATION_BY_ID = '/api/applications/:id',
  GET_LINKS = '/api/links/getLinks',
  GET_LINKS_COUNT_BY_STATUS = '/api/links/count-by-status',
  GET_INTERVIEW_BY_APPLICATION_ID = '/api/interviews/by-application/:applicationId',
  GET_SHARED_INTERVIEW = '/api/interviews/shared',
  GET_INTERVIEW_INSIGHTS = '/api/interviews/share/insights',
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const StatusToColorMapping: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: 'bg-[#A2BFF0]',
  [ApplicationStatus.OA]: 'bg-[#F49DFF]',
  [ApplicationStatus.INTERVIEWING]: 'bg-[#F8FF6A]',
  [ApplicationStatus.OFFERED]: 'bg-[#A3F890]',
  [ApplicationStatus.WITHDRAWN]: 'bg-[#CAAB94]',
  [ApplicationStatus.REJECTED]: 'bg-[#FEB584]',
};

export const LinksColorMapping: Record<LinkStatus, string> = {
  [LinkStatus.PENDING_PROCESSING]: 'bg-[#F49DFF]',
  [LinkStatus.ADMIN_APPROVED]: 'bg-[#A3F890]',
  [LinkStatus.ADMIN_REJECTED]: 'bg-[#FEB584]',
  [LinkStatus.PENDING_ADMIN_REVIEW]: 'bg-[#66FFCC]',
  [LinkStatus.PENDING_RETRY]: 'bg-[#F8FF6A]',
  [LinkStatus.PIPELINE_FAILED]: 'bg-[#A2BFF0]',
  [LinkStatus.PIPELINE_REJECTED]: 'bg-[#CAAB94]',
};

export const InvitationStatusToColorMapping: Record<InvitationStatus, string> =
  {
    [InvitationStatus.ACCEPTED]: 'bg-(--vtmp-green)',
    [InvitationStatus.EXPIRED]: 'bg-(--vtmp-brown)',
    [InvitationStatus.PENDING]: 'bg-(--vtmp-yellow)',
    [InvitationStatus.REVOKED]: 'bg-(--vtmp-orange)',
  };

export const InterviewStatusToColorMapping: Record<InterviewStatus, string> = {
  [InterviewStatus.PENDING]: 'bg-(--vtmp-yellow)',
  [InterviewStatus.FAILED]: 'bg-red-400',
  [InterviewStatus.PASSED]: 'bg-(--vtmp-green)',
  [InterviewStatus.UPCOMING]: 'bg-(--vtmp-blue)',
  [InterviewStatus.WITHDRAWN]: 'bg-gray-600',
};
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 20;
