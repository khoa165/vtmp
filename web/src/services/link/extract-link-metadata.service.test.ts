import { ExtractLinkMetadataService } from '@/services/link/extract-link-metadata.service';

describe('ExtractLinkMetadataService', () => {
  it.only('test', async () => {
    const result = await ExtractLinkMetadataService.extractMetadata(
      'https://www.indeed.com/jobs?l=California&from=searchOnHP%2CsearchSuggestions%2CwhatautocompleteSourceSimba%2Cwhereautocomplete&vjk=984a2429cdb6d200&advn=40459487893339'
    );

    console.log('result:', result);
  });
});
