import { LinkRepository } from '@/repositories/link.repository';
import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
describe.skip('ExtractLinkMetaDataService', () => {
  useMongoDB();
  it('test', async () => {
    const result = await ExtractLinkMetadataService.extractMetadata(
      'https://careers.adobe.com/us/en/job/R147746/2025-Intern-Software-Engineer'
    );
    const link = await LinkRepository.createLink(result);
    console.log(link);
  });
});
