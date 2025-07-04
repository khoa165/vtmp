import {
  CompanyName,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from '@vtmp/common/constants';

import { MentorshipYear } from '#vtmp/web-client/utils/constants';

export type BlogFileMapping = Record<string, BlogFileMetadata>;

interface BlogFileMetadata extends BlogMetadata {
  path: string;
}

export interface BlogMetadata {
  name: string;
  filepath: string;
  title: string;
  authors: string[];
  contributors: string[];
  description: string;
  banner?: string;
  date: string;
  tags: string[];
}

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

export interface DateWithCount {
  date: string;
  count: number;
}

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

export interface MentorshipOffer {
  name: CompanyName;
  type: OfferType;
  channel: OfferChannel;
  date: string;
}

export interface MentorshipPerson {
  name: string;
  firstLast: string;
  alias: string;
  trackingName: string;
  professionalTitle: string;
  hobbies: string;
  avatar: string;
  terms: MentorshipTerm[];
  hasNeverBeenMenteeOfProgram?: boolean;
}

export interface MentorshipTerm {
  year: number;
  title?: string;
  roles: MentorshipRole[];
  offers?: MentorshipOffer[];
  teamName?: string;
  teamNumber?: number;
  teammates?: string[];
  mentors?: string[];
  projectAdvisors?: string[];
}

export type MergedDateWithCount = Partial<Record<MentorshipYear, number>> & {
  date: string;
};

export type MergedInterviewData = Partial<
  Record<
    MentorshipYear,
    {
      totalInvitationsCount: number;
      totalInterviewsCount: number;
      totalMixedCount: number;
      totalTechnicalCount: number;
      totalBehavioralCount: number;
      totalPracticalCount: number;
      datesWithCount: DateWithCount[];
    }
  >
> & {
  data: MergedInterviewRecordsPerCompany[];
  totalInvitationsCount: number;
  totalInterviewsCount: number;
  datesWithCount: MergedDateWithCount[];
};

export type MergedInterviewRecordsPerCompany = Partial<
  Record<
    MentorshipYear,
    {
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
    }
  >
> & {
  company: string;
};
