// import { LinkValidatorService } from '@/services/link-validator.service';
import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { WebScrapingService } from '@/services/web-scraping.service';
import { MetadataPipelineResult } from '@/services/web-scraping.service';

export const LinkProcessorService = {
  // processLink: async (
  //   urls: string[]
  // ): Promise<
  //   | (LinkMetaData & { linkProcessingStatus: LinkProcessingSubStatus })
  //   | { url: string; linkProcessingStatus: LinkProcessingSubStatus }
  // > => {
  //   // const validUrl = await LinkValidatorService.validateLink(url);
  //   const extractedTexts = await WebScrapingService.entryPoint(urls);
  //   // const extractedMetadata = await ExtractLinkMetadataService.extractMetadata(
  //   //   url,
  //   //   extractedText
  //   // );
  //   return {
  //     ...extractedMetadata,
  //     linkProcessingStatus: LinkProcessingSubStatus.SUCCESS,
  //   };
  // },

  processLink: async (urls: string[]): Promise<MetadataPipelineResult[]> => {
    // const validUrl = await LinkValidatorService.validateLink(url);
    const scrapingStageResults = await WebScrapingService.entryPoint(urls);
    const aiMetadataExtractionResults =
      await ExtractLinkMetadataService.extractMetadata(scrapingStageResults);
    return aiMetadataExtractionResults;
  },
};
