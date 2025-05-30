import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';


describe('ExtractLinkMetadataService', () => {
  it.only('test', async () => {
    await ExtractLinkMetadataService.extractMetadata(
      'https://jobs.apple.com/en-us/details/200598711/sa-genius-admin?team=APPST'
    );
  });
});
