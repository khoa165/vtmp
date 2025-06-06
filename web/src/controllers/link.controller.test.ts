import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import app from '@/app';
import { expect } from 'chai';
import request from 'supertest';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { LinkRepository } from '@/repositories/link.repository';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import {
  JobFunction,
  JobPostingRegion,
  JobType,
  LinkStatus,
} from '@vtmp/common/constants';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { ILink } from '@/models/link.model';
import {
  HTTPMethod,
  runDefaultAuthMiddlewareTests,
  runUserLogin,
} from '@/testutils/auth.testutils';
describe('LinkController', () => {
  useMongoDB();
  const sandbox = useSandbox();

  let linkId: string;
  let url: string;
  let googleLink: ILink;
  let mockUserToken: string, mockAdminToken: string;

  const mockLinkData = {
    url: 'https://google.com',
    jobTitle: 'Software Engineer',
    companyName: 'Google',
    submittedBy: getNewMongoId(),
  };
  const mockMultipleLinks = [
    {
      url: 'nvida.com',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    },

    {
      url: 'microsoft.com',
      jobTitle: 'Software Engineer',
      companyName: 'Example Company',
      submittedBy: getNewObjectId(),
    },
  ];

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    ({ mockUserToken, mockAdminToken } = await runUserLogin());

    url = 'https://google.com';
    googleLink = await LinkRepository.createLink(mockLinkData);

    linkId = googleLink.id;
  });

  describe('POST /links', () => {
    runDefaultAuthMiddlewareTests({
      route: '/api/links',
      method: HTTPMethod.POST,
      body: { url: 'https://example.com' },
    });

    it('should return error message for submitting link with not exist url', async () => {
      const res = await request(app)
        .post('/api/links')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('URL is required');
    });

    it('should return a link', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({ url: 'https://example.com' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.message).to.equal(
        'Link has been submitted successfully.'
      );
    });

    it('should throw an Error when submitting exist url', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({ url: googleLink.url })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 409, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Duplicate url');
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
      expect(res.body.data.url).to.equal(url);
      expect(res.body.data.status).to.equal(LinkStatus.REJECTED);
      expect(res.body.message).to.equal('Link has been rejected!');
    });
  });

  describe('POST /links/:id/approve', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/links/${linkId}/approve`,
      method: HTTPMethod.POST,
      body: {
        url: 'https://facebook.com',
        jobTitle: 'Software Engineer Intern',
        companyName: 'Example Company',
      },
    });

    it('should throw ForbiddenError when user try to approve link', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/approve`)
        .send({
          url: 'https://facebook.com',
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
          url: 'https://facebook.com',
          jobTitle: 'Software Engineer Intern',
          companyName: 'Example Company',
          location: JobPostingRegion.CANADA,
          jobFunction: JobFunction.SOFTWARE_ENGINEER,
          jobType: JobType.INTERNSHIP,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);
      console.log(res.body.errors[0].message);
      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Link not found');
    });

    it('should return a job posting after approve', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/approve`)
        .send({
          url: 'https://facebook.com',
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
      expect(res.body.data.url).to.equal(url);
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
        [LinkStatus.PENDING]: 1,
        [LinkStatus.APPROVED]: 0,
        [LinkStatus.REJECTED]: 0,
      });
    });

    it('should return correct link counts for multiple statuses when multiple links exist', async () => {
      await Promise.all(
        mockMultipleLinks.map((link) => LinkRepository.createLink(link))
      );

      await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.APPROVED,
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
        [LinkStatus.PENDING]: 2,
        [LinkStatus.APPROVED]: 1,
        [LinkStatus.REJECTED]: 0,
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
        .get('/api/links?status=APPROVED&extraField=notAllowed')
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
          url: '',
          jobTitle: 'Software Engineer',
        })
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.include('Invalid url');
    });

    it('should return empty array when no links exist with given status', async () => {
      await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.REJECTED,
      });
      const res = await request(app)
        .get(`/api/links?status=${LinkStatus.APPROVED}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return all links when no filter is given', async () => {
      await Promise.all(
        mockMultipleLinks.map((link) => LinkRepository.createLink(link))
      );

      await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.APPROVED,
      });
      const res = await request(app)
        .get('/api/links')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });

      const links = res.body.data.map((link: ILink) => link.url);
      expect(links).to.be.an('array').that.have.lengthOf(3);
      expect(links).to.have.members([
        url,
        ...mockMultipleLinks.map((link) => link.url),
      ]);
    });

    it('should return correct number of links with a given status', async () => {
      await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.APPROVED,
      });

      const res = await request(app)
        .get(`/api/links?status=${LinkStatus.APPROVED}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data[0].url).to.equal(url);
      expect(res.body.data[0].status).to.equal(LinkStatus.APPROVED);
    });
  });
});
