import { createRetryer } from '@/helpers/link.helpers';
import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
import { wait } from 'ts-retry-promise';
import { expect } from 'chai';
describe('ExtractLinkMetaDataService', () => {
  const retryFunction = createRetryer(3, 1);
  it('should throw error when accessing forbidden website', async () => {
    await expect(
      retryFunction(() =>
        ExtractLinkMetadataService.extractMetadata('https://www.indeed.com/')
      )
    ).eventually.rejectedWith(Error);
  });
  it('should throw error when the function exceed time limit', async () => {
    await expect(
      retryFunction(() => {
        wait(2);
        return ExtractLinkMetadataService.extractMetadata(
          'https://www.indeed.com/'
        );
      })
    ).eventually.rejectedWith(Error);
  });
});
