import {
  CompanyName,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from '#vtmp/common/constants/enums';

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
