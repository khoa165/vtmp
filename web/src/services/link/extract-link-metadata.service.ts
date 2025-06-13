import { LinkRegion } from '@vtmp/common/constants';
import { LinkMetaDataType } from '@/types/link.types';

export const ExtractLinkMetadataService = {
  async extractMetadata(url: string): Promise<LinkMetaDataType> {
    return Promise.resolve({
      url: url,
      jobTitle: 'Software Engineer',
      companyName: 'Tech Company',
      location: LinkRegion.US,
      datePosted: new Date(),
      jobDescription: 'Job description goes here.',
    });
  },
};
