import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';
describe.skip('ExtractLinkMetaDataService', () => {
  it('test', async () => {
    const result = await ExtractLinkMetadataService.extractMetadata(
      'https://careers.adobe.com/us/en/job/R147746/2025-Intern-Software-Engineer'
    );
    console.log(result);
  });
});
