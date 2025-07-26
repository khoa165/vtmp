import { Document, Types } from 'mongoose';

import {
  ApplicationStatus,
  InterestLevel,
  InterviewStatus,
  InterviewType,
  InvitationStatus,
  JobFunction,
  JobPostingRegion,
  JobType,
  LinkProcessingFailureStage,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobPostingId: Types.ObjectId;
  companyName?: string;
  jobTitle?: string;
  location?: JobPostingRegion;
  userId: Types.ObjectId;
  hasApplied: boolean;
  status: ApplicationStatus;
  appliedOnDate: Date;
  note?: string;
  deletedAt?: Date;
  referrer?: string;
  portalLink?: string;
  url?: string;
  interest: InterestLevel;
}

export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  originalUrl: string;
  status: LinkStatus;
  failureStage?: LinkProcessingFailureStage;
  submittedOn: Date;
  jobTitle?: string;
  companyName?: string;
  location?: LinkRegion;
  jobFunction?: JobFunction;
  jobType?: JobType;
  datePosted?: Date;
  jobDescription?: string;
  aiNote?: string;
  attemptsCount: number;
  lastProcessedAt?: Date;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
}

export interface IJobPosting extends Document {
  _id: Types.ObjectId;
  linkId: Types.ObjectId;
  externalPostingId?: string;
  url: string;
  jobTitle: string;
  companyName: string;
  location: JobPostingRegion;
  datePosted?: Date;
  jobDescription?: string;
  adminNote?: string;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
  jobFunction: JobFunction;
  jobType: JobType;
}

export interface JobFilter {
  jobTitle?: string;
  companyName?: string;
  location?: string;
  jobFunction?: JobFunction;
  jobType?: JobType;
  postingDateRangeStart?: Date;
  postingDateRangeEnd?: Date;
}

export interface IInterview extends Document {
  _id: Types.ObjectId;
  applicationId: Types.ObjectId;
  userId: Types.ObjectId;
  types: InterviewType[];
  status: InterviewStatus;
  interviewOnDate: Date;
  companyName?: string;
  jobTitle?: string;
  location?: JobPostingRegion;
  note?: string;
  shareStatus?: string;
  deletedAt?: Date;
}

export interface InterviewInsights {
  companyDetails: string;
  companyProducts: string;
  interviewInsights: {
    commonQuestions: string[];
    interviewProcess: string;
    tips: string;
  };
}

export interface IInvitation extends Document {
  _id: Types.ObjectId;
  receiverEmail: string;
  receiverName: string;
  sender: Types.ObjectId;
  token: string;
  expiryDate: Date;
  status: InvitationStatus;
}
