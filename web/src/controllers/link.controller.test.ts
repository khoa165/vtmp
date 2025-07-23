import { expect } from 'chai';
import { beforeEach, describe } from 'mocha';
import request from 'supertest';

import {
  LinkProcessingFailureStage,
  JobFunction,
  JobPostingRegion,
  JobType,
  LinkRegion,
  LinkStatus,
} from '@vtmp/common/constants';

import app from '@/app';
import { EnvConfig } from '@/config/env';
// eslint-disable-next-line boundaries/element-types
import { ILink } from '@/models/link.model';
// eslint-disable-next-line boundaries/element-types
import { LinkRepository } from '@/repositories/link.repository';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
  runUserLogin,
} from '@/testutils/auth.testutils';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';

describe('LinkController', () => {
  useMongoDB();
  const sandbox = useSandbox();

  let linkId: string;
  let originalUrl: string;
  let googleLink: ILink;
  let mockUserToken: string, mockAdminToken: string;

  const mockLinkData = {
    originalUrl: 'https://google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Google',
    submittedBy: getNewMongoId(),
  };
  const mockMultipleLinks = [
    {
      originalUrl: 'https://nvida.com',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    },
    {
      originalUrl: 'https://microsoft.com',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    },
  ];

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    ({ mockUserToken, mockAdminToken } = await runUserLogin());

    originalUrl = 'https://google.com';
    googleLink = await LinkRepository.createLink(getNewMongoId(), mockLinkData);

    linkId = googleLink.id;
  });

  describe('POST /links', () => {
    runDefaultAuthMiddlewareTests({
      route: '/api/links',
      method: HTTPMethod.POST,
      body: {
        url: 'https://example1.com',
      },
    });

    it('should return error message for submitting link with not exist url', async () => {
      const res = await request(app)
        .post('/api/links')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('URL is required');
    });

    it('should throw a duplicate error when submitting exist url', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({ originalUrl: googleLink.originalUrl })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Duplicate link found');
    });

    it('should return a link', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({
          originalUrl: 'https://example2.com',
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.message).to.equal(
        'Link has been submitted successfully.'
      );
    });
  });

  describe('POST /links/:id/reject', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/links/${linkId}/reject`,
      method: HTTPMethod.POST,
    });

    it('should throw ForbiddenError when user try to reject link', async () => {
      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/reject`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should return error message for rejecting not exist link', async () => {
      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/reject`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Link not found');
    });

    it('should return a rejected link', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/reject`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.originalUrl).to.equal(originalUrl);
      expect(res.body.data.status).to.equal(LinkStatus.ADMIN_REJECTED);
      expect(res.body.message).to.equal('Link has been rejected by admin');
    });
  });

  describe('POST /links/:id/approve', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/links/${linkId}/approve`,
      method: HTTPMethod.POST,
      body: {
        originalUrl: 'https://facebook.com',
        jobTitle: 'Software Engineer Intern',
        companyName: 'Example Company',
      },
    });

    it('should throw ForbiddenError when user try to approve link', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/approve`)
        .send({
          originalUrl: 'https://facebook.com',
          jobTitle: 'Software Engineer Intern',
          companyName: 'Example Company',
          location: JobPostingRegion.US,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should return error message for approving with not exist link', async () => {
      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/approve`)
        .send({
          originalUrl: 'https://facebook.com',
          jobTitle: 'Software Engineer Intern',
          companyName: 'Example Company',
          location: JobPostingRegion.CANADA,
          jobFunction: JobFunction.SOFTWARE_ENGINEER,
          jobType: JobType.INTERNSHIP,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Link not found');
    });

    it('should return a job posting after approve', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/approve`)
        .send({
          originalUrl: 'https://facebook.com',
          jobTitle: 'Software Engineer Intern',
          companyName: 'Example Company',
          location: JobPostingRegion.CANADA,
          jobFunction: JobFunction.SOFTWARE_ENGINEER,
          jobType: JobType.INTERNSHIP,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal('Link has been approved!');
      expect(res.body.data.url).to.equal(originalUrl);
    });
  });

  describe('PUT /links/metadata', () => {
    const mockLinkMetaData = {
      url: 'google.com',
      location: LinkRegion.US,
      jobFunction: JobFunction.SOFTWARE_ENGINEER,
      jobType: JobType.INTERNSHIP,
      datePosted: new Date(),
      attemptsCount: 1,
      lastProcessedAt: new Date(),
    };

    runDefaultAuthMiddlewareTests({
      route: `/api/links/${linkId}/metaData`,
      method: HTTPMethod.PUT,
      body: {
        ...mockLinkMetaData,
        status: LinkStatus.PIPELINE_REJECTED,
        failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
      },
    });

    it('should return error message for updating with not exist link', async () => {
      const res = await request(app)
        .put(`/api/links/${getNewMongoId()}/metadata`)
        .send({
          ...mockLinkMetaData,
          status: LinkStatus.PIPELINE_REJECTED,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`); // should be replaced to link processing service token
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Link not found');
    });

    it('should return error message for not including failure stage when status is failed', async () => {
      const res = await request(app)
        .put(`/api/links/${googleLink.id}/metadata`)
        .send({
          ...mockLinkMetaData,
          status: LinkStatus.PIPELINE_REJECTED,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`); // should be replaced to link processing service token;
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invalid failure stage');
    });

    it('should return link with updated metadata with status not failed', async () => {
      const res = await request(app)
        .put(`/api/links/${googleLink.id}/metadata`)
        .send({
          ...mockLinkMetaData,
          status: LinkStatus.PIPELINE_REJECTED,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`); // should be replaced to link processing service token
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal('Link metadata has been updated!');
    });

    it('should return error when trying to reset status to PENDING_PROCESSING', async () => {
      const res = await request(app)
        .put(`/api/links/${googleLink.id}/metadata`)
        .send({
          ...mockLinkMetaData,
          status: LinkStatus.PENDING_PROCESSING,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
        })
        .set('Authorization', `Bearer ${mockAdminToken}`);
      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.include(
        'status cannot be reset to PENDING_PROCESSING'
      );
    });

    it('should return link with updated metadata with status failed', async () => {
      const res = await request(app)
        .put(`/api/links/${googleLink.id}/metadata`)
        .send({
          ...mockLinkMetaData,
          status: LinkStatus.PIPELINE_REJECTED,
          failureStage: LinkProcessingFailureStage.SCRAPING_FAILED,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`); // should be replaced to link processing service token
      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal('Link metadata has been updated!');
    });
  });

  describe('GET /links/count-by-status', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/links/count-by-status`,
      method: HTTPMethod.GET,
    });

    it('should throw ForbiddenError when user try to view link status', async () => {
      const res = await request(app)
        .get('/api/links/count-by-status')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should return 1 link for pending status', async () => {
      const res = await request(app)
        .get('/api/links/count-by-status')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal(
        'Link count has been retrieved successfully.'
      );
      expect(res.body.data).to.deep.equal({
        [LinkStatus.PENDING_PROCESSING]: 1,
        [LinkStatus.ADMIN_APPROVED]: 0,
        [LinkStatus.ADMIN_REJECTED]: 0,
        [LinkStatus.PENDING_ADMIN_REVIEW]: 0,
        [LinkStatus.PENDING_RETRY]: 0,
        [LinkStatus.PIPELINE_FAILED]: 0,
        [LinkStatus.PIPELINE_REJECTED]: 0,
      });
    });

    it('should return correct link counts for multiple statuses when multiple links exist', async () => {
      await Promise.all(
        mockMultipleLinks.map((link) =>
          LinkRepository.createLink(getNewMongoId(), link)
        )
      );

      await LinkRepository.updateLinkMetaData(linkId, {
        status: LinkStatus.ADMIN_APPROVED,
        failureStage: null,
      });

      const res = await request(app)
        .get('/api/links/count-by-status')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal(
        'Link count has been retrieved successfully.'
      );
      expect(res.body.data).to.deep.equal({
        [LinkStatus.PENDING_PROCESSING]: 2,
        [LinkStatus.ADMIN_APPROVED]: 1,
        [LinkStatus.ADMIN_REJECTED]: 0,
        [LinkStatus.PENDING_ADMIN_REVIEW]: 0,
        [LinkStatus.PENDING_RETRY]: 0,
        [LinkStatus.PIPELINE_FAILED]: 0,
        [LinkStatus.PIPELINE_REJECTED]: 0,
      });
    });
  });

  describe('GET /links', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/links`,
      method: HTTPMethod.GET,
    });

    it('should throw ForbiddenError when user try to view links', async () => {
      const res = await request(app)
        .get('/api/links')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should return 400 when an invalid status is provided', async () => {
      const res = await request(app)
        .get('/api/links?status=INVALID_STATUS')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.include('Invalid link status');
    });

    it('should return 400 when query contains fields other than status', async () => {
      const res = await request(app)
        .get('/api/links?status=ADMIN_APPROVED&extraField=notAllowed')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.include(
        'Only allow filtering by given fields'
      );
    });

    it('should return 400 when unknown field is used without status', async () => {
      const res = await request(app)
        .get('/api/links?unexpectedField=value')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.include(
        'Only allow filtering by given fields'
      );
    });

    it('should return 400 when required fields are missing during link creation', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({
          originalUrl: '',
          jobTitle: 'Software Engineer',
        })
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.include('Invalid url');
    });

    it('should return empty array when no links exist with given status', async () => {
      await LinkRepository.updateLinkMetaData(linkId, {
        status: LinkStatus.ADMIN_REJECTED,
        failureStage: null,
      });
      const res = await request(app)
        .get(`/api/links?status=${LinkStatus.ADMIN_APPROVED}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return all links when no filter is given', async () => {
      await Promise.all(
        mockMultipleLinks.map((link) =>
          LinkRepository.createLink(getNewMongoId(), link)
        )
      );

      await LinkRepository.updateLinkMetaData(linkId, {
        status: LinkStatus.ADMIN_APPROVED,
        failureStage: null,
      });
      const res = await request(app)
        .get('/api/links')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });

      const links = res.body.data.map((link: ILink) => link.originalUrl);
      expect(links).to.be.an('array').that.have.lengthOf(3);
      expect(links).to.have.members([
        originalUrl,
        ...mockMultipleLinks.map((link) => link.originalUrl),
      ]);
    });

    it('should return correct number of links with a given status', async () => {
      await LinkRepository.updateLinkMetaData(linkId, {
        status: LinkStatus.ADMIN_APPROVED,
        failureStage: null,
      });

      const res = await request(app)
        .get(`/api/links?status=${LinkStatus.ADMIN_APPROVED}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data[0].originalUrl).to.equal(originalUrl);
      expect(res.body.data[0].status).to.equal(LinkStatus.ADMIN_APPROVED);
    });
  });
});
