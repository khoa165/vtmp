import { JobPostingRegion } from '@vtmp/common/constants';
export type LinkMetaData = {
  url: string;
  jobTitle?: string;
  companyName?: string;
  location?: JobPostingRegion;
  datePosted?: string;
  jobDescription?: string;
};
