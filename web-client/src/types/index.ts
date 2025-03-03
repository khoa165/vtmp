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

export interface BlogFileMapping {
  [key: string]: BlogFileMetadata;
}

export type MentorshipOffer = {
  name: CompanyName;
  type: OfferType;
  channel: OfferChannel;
  date: string;
};

export type MentorshipTerm = {
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
};

export type MentorshipPerson = {
  name: string;
  alias: string;
  trackingName: string;
  hobbies: string;
  avatar: string;
  terms: MentorshipTerm[];
  hasNeverBeenMenteeOfProgram?: boolean;
};

export type InterviewRecordsPerCompany = {
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
};

export type MergedInterviewRecordsPerCompany = {
  [key in MentorshipYear]?: {
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
  };
} & {
  company: string;
};

export interface DateWithCount {
  date: string;
  count: number;
}

export type MergedDateWithCount = {
  [key in MentorshipYear]?: number;
} & {
  date: string;
};

export type InterviewData = {
  totalInvitationsCount: number;
  totalInterviewsCount: number;
  totalMixedCount: number;
  totalTechnicalCount: number;
  totalBehavioralCount: number;
  totalPracticalCount: number;
  datesWithCount: DateWithCount[];
  data: InterviewRecordsPerCompany[];
};

export type MergedInterviewData = {
  [key in MentorshipYear]?: {
    totalInvitationsCount: number;
    totalInterviewsCount: number;
    totalMixedCount: number;
    totalTechnicalCount: number;
    totalBehavioralCount: number;
    totalPracticalCount: number;
    datesWithCount: DateWithCount[];
  };
} & {
  data: MergedInterviewRecordsPerCompany[];
  totalInvitationsCount: number;
  totalInterviewsCount: number;
  datesWithCount: MergedDateWithCount[];
};

export type CompanyMetadata = {
  displayName: string;
  logoFilename: string;
  maxLogoSize: number;
  isPartTimeOffer?: boolean;
};

export type CompanyMetadataWithOffers = CompanyMetadata & {
  logoUrl: string;
  offersCountTotal: number;
  offersCountByYear: {
    [key: number]: number;
  };
};
