import { LinkMetaDataType } from '@/types/link.types';

export const ExtractLinkMetadataService = {
  async extractMetadata(url: string): Promise<LinkMetaDataType> {
    return Promise.resolve({
      originalUrl: url,
    });
  },
};
