import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';

import assert from 'assert';

import { LinkStatus } from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { LinkRepository } from '@/repositories/link.repository';
import { CronService } from '@/services/link/cron.service';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { InternalServerError } from '@/utils/errors';

describe('CronService', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let stubSendLinkToLambda: sinon.SinonStub;
  const successfulLink = {
    _id: '123',
    originalUrl: 'https://example.com',
    metadata: { title: 'Example' },
  };
  const failedLinks = {
    _id: '456',
    originalUrl: 'https://example.org',
    error: 'Failed to scrape',
  };
  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    stubSendLinkToLambda = sandbox
      .stub(CronService, '_sendLinksToLambda')
      .resolves({
        data: {
          message: 'hello',
          body: JSON.stringify({
            successfulLinks: [successfulLink],
            failedLinks: [failedLinks],
          }),
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse);
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
  });
  const filteredLinks = [
    {
      originalUrl: 'https://example.com',
      status: LinkStatus.PENDING_PROCESSING,
    },
    {
      originalUrl: 'https://example.org',
      status: LinkStatus.PENDING_RETRY,
      attemptsCount: 2,
      lastProcessedAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];
  const createFilteredLinks = async () => {
    assert(filteredLinks[0]);
    assert(filteredLinks[1]);
    await LinkRepository.createLink({
      submittedBy: getNewMongoId(),
      linkMetaData: filteredLinks[0],
    });
    await LinkRepository.createLink({
      submittedBy: getNewMongoId(),
      linkMetaData: filteredLinks[1],
    });
  };
  const createUnFilteredLinks = async () => {
    const unFilteredLinks = [
      {
        originalUrl: 'https://example.net',
        status: LinkStatus.PIPELINE_FAILED,
        attemptsCount: 1,
        lastProcessedAt: new Date(),
      },
      {
        originalUrl: 'https://example.edu',
        status: LinkStatus.PENDING_RETRY,
        attemptsCount: 5,
        lastProcessedAt: new Date(),
      },
    ];

    assert(unFilteredLinks[0]);
    assert(unFilteredLinks[1]);
    await LinkRepository.createLink({
      submittedBy: getNewMongoId(),
      linkMetaData: unFilteredLinks[0],
    });
    await LinkRepository.createLink({
      submittedBy: getNewMongoId(),
      linkMetaData: unFilteredLinks[1],
    });
  };
  describe('_getRetryFilter', () => {
    it('should return empty links', async () => {
      await createUnFilteredLinks();
      const result = await LinkRepository.getLinks(
        CronService._getRetryFilter()
      );
      expect(result).to.have.lengthOf(0);
    });
    it('should return correct filter for links to retry', async () => {
      await createFilteredLinks();
      const result = await LinkRepository.getLinks(
        CronService._getRetryFilter()
      );
      console.log('result: ', result);
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.deep.include(filteredLinks[0]);
      expect(result[1]).to.deep.include(filteredLinks[1]);
    });
  });
  describe('trigger', () => {
    it('should throw error when _sendLinksToLambda fails', async () => {
      await createFilteredLinks();
      stubSendLinkToLambda.throws();
      await expect(CronService.trigger()).eventually.rejectedWith(
        InternalServerError
      );
    });

    it('should return empty successfulLinks and empty failedLinks successfully', async () => {
      await createUnFilteredLinks();
      const result = await CronService.trigger();
      expect(result.successfulLinks).to.be.an('array').to.deep.equal([]);
      expect(result.failedLinks).to.be.an('array').to.deep.equal([]);
    });

    it('should return successfulLinks and failedLinks successfully', async () => {
      await createFilteredLinks();
      const result = await CronService.trigger();
      expect(result.successfulLinks).to.deep.include(successfulLink);
      expect(result.failedLinks).to.deep.include(failedLinks);
    });
  });

  describe('requestTriggerLinks', () => {
    let linkId: string;
    beforeEach(async () => {
      await createUnFilteredLinks();
      const result = await LinkRepository.getLinks();
      assert(result[0]);
      linkId = result[0]._id.toString();
    });

    it('should throw error when _sendLinksToLambda fails', async () => {
      stubSendLinkToLambda.throws();
      await expect(
        CronService.requestTriggerLinks(linkId)
      ).eventually.rejectedWith(InternalServerError);
    });

    it('should return empty successfulLinks and empty failedLinks successfully', async () => {
      const result = await CronService.requestTriggerLinks(getNewMongoId());
      expect(result.successfulLinks).to.be.an('array').to.deep.equal([]);
      expect(result.failedLinks).to.be.an('array').to.deep.equal([]);
    });

    it('should return successfulLinks and failedLinks successfully', async () => {
      const result = await CronService.requestTriggerLinks(linkId);
      expect(result.successfulLinks).to.deep.include(successfulLink);
      expect(result.failedLinks).to.deep.include(failedLinks);
    });
  });
});
