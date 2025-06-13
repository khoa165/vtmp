import { JobPostingRegion } from '@vtmp/common/constants';
import { LinkMetaData } from '@/services/link/link.types';

export const ExtractLinkMetadataService = {
  async extractMetadata(url: string): Promise<LinkMetaData> {
    return Promise.resolve({
      url: url,
      jobTitle: 'Software Engineer',
      companyName: 'Tech Company',
      location: JobPostingRegion.US,
      datePosted: '2023-10-01',
      jobDescription: 'Job description goes here.',
    });
  },
};
