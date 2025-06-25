import { expect } from 'chai';

import {
  LinkRegion,
  JobFunction,
  JobType,
  LinkProcessingFailureStage,
  LinkStatus,
} from '@vtmp/common/constants';

import {
  GoogleGenAIModel,
  _generateMetadata,
  ExtractLinkMetadataService,
} from '@/services/extract-link-metadata.service';
import { useSandbox } from '@/testutils/sandbox.testutil';
import {
  FailedProcessedLink,
  MetadataExtractedLink,
  ScrapedLink,
} from '@/types/link-processing.types';
import { AIResponseEmptyError, ServiceSpecificError } from '@/utils/errors';

describe('ExtractLinkMetadatService', () => {
  const sandbox = useSandbox();
  const fakeText = 'Some scraped text';
  const fakeUrl = 'https://example.com/job';
  const fakeAIResponse = {
    jobTitle: 'Software Engineer',
    companyName: 'Tech Corp',
    location: LinkRegion.US,
    jobFunction: JobFunction.SOFTWARE_ENGINEER,
    jobType: JobType.INTERNSHIP,
    datePosted: '2024-05-10',
    jobDescription: {},
  };

  let generateContentStub: sinon.SinonStub;

  beforeEach(() => {
    generateContentStub = sandbox.stub(GoogleGenAIModel, 'generateContent');
  });

  describe('_generateMetadata', () => {
    it('should throw AIResponseEmptyError if AI response text is empty', async () => {
      generateContentStub.resolves({
        text: '', // empty response
      });
      await expect(
        _generateMetadata(fakeText, fakeUrl)
      ).eventually.rejectedWith(AIResponseEmptyError);
    });

    it('should throw when AI response JSON is invalid', async () => {
      generateContentStub.resolves({
        text: '```json\nnot a json\n```',
      });
      await expect(
        _generateMetadata(fakeText, fakeUrl)
      ).eventually.rejectedWith(SyntaxError);
    });

    it('should return formatted metadata on valid AI response', async () => {
      generateContentStub.resolves({
        text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
      });

      const result = await _generateMetadata(fakeText, fakeUrl);

      expect(result).to.deep.include({
        jobTitle: 'Software Engineer',
        companyName: 'Tech Corp',
        datePosted: '2024-05-10',
      });
    });
  });

  describe('extractMetadata', () => {
    const links: ScrapedLink[] = [
      {
        originalRequest: {
          _id: 'test1',
          originalUrl: 'test1',
          attemptsCount: 1,
        },
        url: 'https://example.com/1',
        scrapedText: 'text1',
      },
      {
        originalRequest: {
          _id: 'test2',
          originalUrl: 'test3',
          attemptsCount: 1,
        },
        url: 'https://example.com/2',
        scrapedText: 'text1',
      },
    ];

    it('should return 2 successes when both links extract metadata successfully', async () => {
      generateContentStub.resolves({
        text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
      });

      const result: {
        metadataExtractedLinks: MetadataExtractedLink[];
        failedMetadataExtractionLinks: FailedProcessedLink[];
      } = await ExtractLinkMetadataService.extractMetadata(links);

      expect(result.metadataExtractedLinks).to.have.length(2);
      expect(result.failedMetadataExtractionLinks).to.have.length(0);
      expect(result.metadataExtractedLinks[0]?.url).to.equal(
        'https://example.com/1'
      );
      expect(result.metadataExtractedLinks[1]?.url).to.equal(
        'https://example.com/2'
      );
      expect(result.metadataExtractedLinks[0]?.status).to.equal(
        LinkStatus.PENDING_ADMIN_REVIEW
      );
    });

    it('should return 1 success and 1 failure when one link fails metadata extraction', async () => {
      generateContentStub.onFirstCall().resolves({
        text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
      });

      generateContentStub.onSecondCall().resolves({
        text: '', // empty response
      });

      const result: {
        metadataExtractedLinks: MetadataExtractedLink[];
        failedMetadataExtractionLinks: FailedProcessedLink[];
      } = await ExtractLinkMetadataService.extractMetadata(links);

      expect(result.metadataExtractedLinks).to.have.length(1);
      expect(result.failedMetadataExtractionLinks).to.have.length(1);

      expect(result.metadataExtractedLinks[0]?.url).to.equal(
        'https://example.com/1'
      );
      expect(result.failedMetadataExtractionLinks[0]?.url).to.equal(
        'https://example.com/2'
      );
      expect(result.failedMetadataExtractionLinks[0]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(result.failedMetadataExtractionLinks[0]?.error).to.be.instanceOf(
        ServiceSpecificError
      );
    });

    it('should return 2 failures when both links fail metadata extraction', async () => {
      generateContentStub.resolves({
        text: '', // empty response
      });
      const result: {
        metadataExtractedLinks: MetadataExtractedLink[];
        failedMetadataExtractionLinks: FailedProcessedLink[];
      } = await ExtractLinkMetadataService.extractMetadata(links);

      expect(result.metadataExtractedLinks).to.have.length(0);
      expect(result.failedMetadataExtractionLinks).to.have.length(2);

      expect(result.failedMetadataExtractionLinks[0]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(result.failedMetadataExtractionLinks[1]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(result.failedMetadataExtractionLinks[0]?.error).to.be.instanceOf(
        ServiceSpecificError
      );
      expect(result.failedMetadataExtractionLinks[1]?.error).to.be.instanceOf(
        ServiceSpecificError
      );
    });
  });
});
