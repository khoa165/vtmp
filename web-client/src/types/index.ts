import {
  CompanyName,
  MentorshipRole,
  OfferChannel,
  OfferType,
  MentorshipYear,
} from 'utils/constants';

export interface BlogMetadata {
  name: string;
  title: string;
  authors: string[];
  contributors?: string;
  description: string;
  banner?: string;
  date: string;
  tags: string[];
}

interface BlogFileMetadata extends BlogMetadata {
  path: string;
}

export type BlogFileMapping = Record<string, BlogFileMetadata>;

export interface MentorshipOffer {
  name: CompanyName;
  type: OfferType;
  channel: OfferChannel;
  date: string;
}

export interface MentorshipTerm {
  year: number;
  title?: string;
  roles: MentorshipRole[];
  offers?: MentorshipOffer[];
  teamName?: string;
  teamNumber?: number;
  teamRanking?: number;
  teammates?: string[];
  mentors?: string[];
  projectAdvisors?: string[];
}

export interface MentorshipPerson {
  name: string;
  alias: string;
  trackingName: string;
  hobbies: string;
  avatar: string;
  terms: MentorshipTerm[];
  hasNeverBeenMenteeOfProgram?: boolean;
}

export interface InterviewRecordsPerCompany {
  invitationsCount: number;
  interviewsCount: number;
  mixedCount: number;
  technicalCount: number;
  behavioralCount: number;
  practicalCount: number;
  interviews: {
    date: string;
    type: string;
    person: string;
  }[];
  company: string;
}

export type MergedInterviewRecordsPerCompany = Partial<Record<MentorshipYear, {
    invitationsCount: number;
    interviewsCount: number;
    mixedCount: number;
    technicalCount: number;
    behavioralCount: number;
    practicalCount: number;
    interviews: {
      date: string;
      type: string;
      person: string;
    }[];
  }>> & {
  company: string;
};

export interface DateWithCount {
  date: string;
  count: number;
}

export type MergedDateWithCount = Partial<Record<MentorshipYear, number>> & {
  date: string;
};

export interface InterviewData {
  totalInvitationsCount: number;
  totalInterviewsCount: number;
  totalMixedCount: number;
  totalTechnicalCount: number;
  totalBehavioralCount: number;
  totalPracticalCount: number;
  datesWithCount: DateWithCount[];
  data: InterviewRecordsPerCompany[];
}

export type MergedInterviewData = Partial<Record<MentorshipYear, {
    totalInvitationsCount: number;
    totalInterviewsCount: number;
    totalMixedCount: number;
    totalTechnicalCount: number;
    totalBehavioralCount: number;
    totalPracticalCount: number;
    datesWithCount: DateWithCount[];
  }>> & {
  data: MergedInterviewRecordsPerCompany[];
  totalInvitationsCount: number;
  totalInterviewsCount: number;
  datesWithCount: MergedDateWithCount[];
};

export interface CompanyMetadata {
  displayName: string;
  logoFilename: string;
  maxLogoSize: number;
  isPartTimeOffer?: boolean;
}

export type CompanyMetadataWithOffers = CompanyMetadata & {
  logoUrl: string;
  offersCountTotal: number;
  offersCountByYear: Record<number, number>;
};
