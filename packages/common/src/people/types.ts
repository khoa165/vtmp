import {
  CompanyName,
  MentorshipRole,
  OfferChannel,
  OfferType,
} from '#vtmp/common/constants/enums';
import { PeopleName } from '#vtmp/common/people/enums';

export interface CompanyMetadata {
  displayName: string;
  logoFilename: string;
  maxLogoSize: number;
  isPartTimeOffer?: boolean;
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
  trackingKey: string;
  trackingName: string;
  professionalTitle: string;
  hobbies: string;
  avatar: string;
  terms: MentorshipTerm[];
  school?: string;
  linkedin?: string;
  isFounder?: boolean;
  hasNeverBeenMenteeOfProgram?: boolean;
  externallyRecruited?: boolean;
}

export interface MentorshipTerm {
  year: number;
  title?: string;
  roles: MentorshipRole[];
  offers?: MentorshipOffer[];
  teamName?: string;
  teamNumber?: number;
  teammates?: PeopleName[];
  mentors?: PeopleName[];
  projectAdvisors?: PeopleName[];
}
