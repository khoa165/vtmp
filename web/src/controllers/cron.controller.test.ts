import { AxiosResponse } from 'axios';
import { expect } from 'chai';
import { beforeEach, describe } from 'mocha';
import request from 'supertest';

import assert from 'assert';

import { LinkStatus } from '@vtmp/common/constants';

import app from '@/app';
import { EnvConfig } from '@/config/env';
import { LinkRepository } from '@/repositories/link.repository';
import { CronService } from '@/services/link/cron.service';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
  runUserLogin,
} from '@/testutils/auth.testutils';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

// Will add authentication test later on
describe('CronController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let mockAdminToken: string, mockUserToken: string;
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
    ({ mockUserToken, mockAdminToken } = await runUserLogin());

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
    await LinkRepository.createLink(filteredLinks[0]);
    await LinkRepository.createLink(filteredLinks[1]);
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
    await LinkRepository.createLink(unFilteredLinks[0]);
    await LinkRepository.createLink(unFilteredLinks[1]);
  };
  describe('POST /cron/trigger', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/cron/trigger`,
      method: HTTPMethod.POST,
    });

    it('should throw forbidden error', async () => {
      const res = await request(app)
        .post('/api/cron/trigger')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);
      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should throw error when _sendLinksToLambda fails', async () => {
      await createFilteredLinks();
      stubSendLinkToLambda.throws();
      const res = await request(app)
        .post('/api/cron/trigger')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 500, errorsCount: 1 });
    });

    it('should return empty successfulLinks and empty failedLinks successfully', async () => {
      await createUnFilteredLinks();
      const res = await request(app)
        .post('/api/cron/trigger')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal(
        'Cron job has been triggered successfully.'
      );
      expect(res.body.data.successfulLinks).to.deep.equal([]);
      expect(res.body.data.failedLinks).to.deep.equal([]);
    });

    it('should return successfulLinks and failedLinks correctly', async () => {
      await createFilteredLinks();
      const res = await request(app)
        .post('/api/cron/trigger')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal(
        'Cron job has been triggered successfully.'
      );
      expect(res.body.data.successfulLinks).to.deep.equal([successfulLink]);
      expect(res.body.data.failedLinks).to.deep.equal([failedLinks]);
    });
  });
});
