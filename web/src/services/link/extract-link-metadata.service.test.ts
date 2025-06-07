import { createRetryer } from '@/helpers/link.helpers';
import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
describe.only('ExtractLinkMetaDataService', () => {
  useMongoDB();
  const retryFunction = createRetryer();
  it('test', async () => {
    const result = await retryFunction(() =>
      ExtractLinkMetadataService.extractMetadata('https://www.indeed.com/')
    );
    console.log(result);
  });
});
