import { expect } from 'chai';

import {
  LinkRegion,
  JobFunction,
  JobType,
  LinkProcessingFailureStage,
  LinkStatus,
} from '@vtmp/common/constants';

import { ExtractLinkMetadataService } from '@/services/extract-link-metadata.service';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { ScrapedLink } from '@/types/link-processing.types';
import { AIExtractionError, AIResponseEmptyError } from '@/utils/errors';

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
  };

  let generateContentStub: sinon.SinonStub;

  beforeEach(() => {
    generateContentStub = sandbox.stub(
      ExtractLinkMetadataService,
      '_generateContent'
    );
    sandbox.stub(console, 'error'); // Suppress console errors in tests
  });

  describe('_generateMetadata', () => {
    it('should throw AIResponseEmptyError if AI response text is empty', async () => {
      generateContentStub.resolves({
        text: '', // empty response
      });
      await expect(
        ExtractLinkMetadataService._generateMetadata(fakeText, fakeUrl)
      ).eventually.rejectedWith(AIResponseEmptyError);
    });

    it('should throw when AI response JSON is invalid', async () => {
      generateContentStub.resolves({
        text: '```json\nnot a json\n```',
      });
      await expect(
        ExtractLinkMetadataService._generateMetadata(fakeText, fakeUrl)
      ).eventually.rejectedWith(SyntaxError);
    });

    it('should return formatted metadata on valid AI response', async () => {
      generateContentStub.resolves({
        text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
      });

      const result = await ExtractLinkMetadataService._generateMetadata(
        fakeText,
        fakeUrl
      );

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

      const { metadataExtractedLinks, failedMetadataExtractionLinks } =
        await ExtractLinkMetadataService.extractMetadata(links);

      expect(metadataExtractedLinks).to.have.length(2);
      expect(failedMetadataExtractionLinks).to.have.length(0);
      expect(metadataExtractedLinks[0]?.extractedMetadata).to.deep.include(
        fakeAIResponse
      );
      expect(metadataExtractedLinks[1]?.extractedMetadata).to.deep.include(
        fakeAIResponse
      );
      expect(metadataExtractedLinks[0]?.status).to.equal(
        LinkStatus.PENDING_ADMIN_REVIEW
      );
      expect(metadataExtractedLinks[1]?.status).to.equal(
        LinkStatus.PENDING_ADMIN_REVIEW
      );

      expect(metadataExtractedLinks[0]?.failureStage).to.equal(null);
      expect(metadataExtractedLinks[1]?.failureStage).to.equal(null);
    });

    it('should return 1 success and 1 failure when one link fails metadata extraction', async () => {
      generateContentStub
        .onFirstCall()
        .resolves({
          text: `\`\`\`json\n${JSON.stringify(fakeAIResponse)}\n\`\`\``,
        })
        .onSecondCall()
        .throws();

      const { metadataExtractedLinks, failedMetadataExtractionLinks } =
        await ExtractLinkMetadataService.extractMetadata(links);

      expect(metadataExtractedLinks).to.have.length(1);
      expect(failedMetadataExtractionLinks).to.have.length(1);

      expect(metadataExtractedLinks[0]?.extractedMetadata).to.deep.include(
        fakeAIResponse
      );
      expect(metadataExtractedLinks[0]?.status).to.equal(
        LinkStatus.PENDING_ADMIN_REVIEW
      );
      expect(metadataExtractedLinks[0]?.failureStage).to.equal(null);
      expect(failedMetadataExtractionLinks[0]?.url).to.equal(
        'https://example.com/2'
      );
      expect(failedMetadataExtractionLinks[0]?.status).to.equal(
        LinkStatus.PENDING_RETRY
      );
      expect(failedMetadataExtractionLinks[0]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(failedMetadataExtractionLinks[0]?.error).to.be.instanceOf(
        AIExtractionError
      );
    });

    it('should return 2 failures when both links fail metadata extraction', async () => {
      generateContentStub.throws();

      const { metadataExtractedLinks, failedMetadataExtractionLinks } =
        await ExtractLinkMetadataService.extractMetadata(links);

      expect(metadataExtractedLinks).to.have.length(0);
      expect(failedMetadataExtractionLinks).to.have.length(2);

      expect(failedMetadataExtractionLinks[0]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(failedMetadataExtractionLinks[0]?.status).to.equal(
        LinkStatus.PENDING_RETRY
      );
      expect(failedMetadataExtractionLinks[1]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(failedMetadataExtractionLinks[1]?.status).to.equal(
        LinkStatus.PENDING_RETRY
      );
      expect(failedMetadataExtractionLinks[0]?.error).to.be.instanceOf(
        AIExtractionError
      );
      expect(failedMetadataExtractionLinks[1]?.error).to.be.instanceOf(
        AIExtractionError
      );
    });

    it('should handle empty scrapedLinks array', async () => {
      const warnStub = sandbox.spy(console, 'warn');

      const { metadataExtractedLinks, failedMetadataExtractionLinks } =
        await ExtractLinkMetadataService.extractMetadata([]);

      expect(warnStub).calledWith(
        '[ExtractLinkMetadataService] WARN: Empty scrapedLinks. Will not extract metadata for any links for this run.'
      );
      expect(metadataExtractedLinks).to.have.length(0);
      expect(failedMetadataExtractionLinks).to.have.length(0);
    });

    it('should return correct status when attemptsCount reach maxLongRetry', async () => {
      const linksWithMaxAttempts: ScrapedLink[] = [
        {
          originalRequest: {
            _id: 'test1',
            originalUrl: 'test1',
            attemptsCount: 4, // maxLongRetry
          },
          url: 'https://example.com/1',
          scrapedText: 'text1',
        },
      ];

      generateContentStub.throws();

      const { metadataExtractedLinks, failedMetadataExtractionLinks } =
        await ExtractLinkMetadataService.extractMetadata(linksWithMaxAttempts);

      expect(metadataExtractedLinks).to.have.length(0);
      expect(failedMetadataExtractionLinks).to.have.length(1);
      expect(failedMetadataExtractionLinks[0]?.status).to.equal(
        LinkStatus.PIPELINE_FAILED
      );
      expect(failedMetadataExtractionLinks[0]?.failureStage).to.equal(
        LinkProcessingFailureStage.EXTRACTION_FAILED
      );
      expect(failedMetadataExtractionLinks[0]?.error).to.be.instanceOf(
        AIExtractionError
      );
    });
  });
});
