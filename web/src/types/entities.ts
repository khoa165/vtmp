import { Document, Types } from 'mongoose';

import {
  ApplicationStatus,
  InterestLevel,
  JobPostingRegion,
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
