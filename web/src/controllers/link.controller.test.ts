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
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { LinkStatus } from '@vtmp/common/constants';

describe('LinkController', () => {
  useMongoDB();
  let linkId: string;
  let url: string;

  beforeEach(async () => {
    url = 'http://example.com/job-posting';
    const newLink = await LinkRepository.createLink(url);
    linkId = newLink.id;
  });

  describe('submitLink', () => {
    it('should return error message for submitting link with not exist url', async () => {
      const res = await request(app)
        .post('/api/links')
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('URL is required');
    });

    it('should return a link', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({ url: 'https://example.com' })
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 201 });
      expect(res.body.message).to.equal(
        'Link has been submitted successfully.'
      );
    });
  });

  describe('rejectLink', () => {
    it('should return error message for rejecting not exist link', async () => {
      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/reject`)
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });

      const errors = res.body.errors;
      expect(errors[0].message).to.equal('Link not found');
    });

    it('should return a rejected link', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/reject`)
        .set('Accept', 'application/json');

      expect(res.body.data.link.url).to.equal(url);
      expect(res.body.message).to.equal('Link has been rejected!');
    });
  });

  describe('approveLink', () => {
    it('should return error message for approving with not exist link', async () => {
      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/approve`)
        .send({
          jobTitle: 'Software Engineer Intern',
          companyName: 'Example Company',
        })
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
    });

    it('should return a approved link', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/approve`)
        .send({
          jobTitle: 'Software Engineer Intern',
          companyName: 'Example Company',
        })
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal('Link has been approved!');
      expect(res.body.data.link.url).to.equal(url);
    });
  });

  describe('getLinkCountByStatus', () => {
    it('should return object of count by pending status', async () => {
      const res = await request(app)
        .get('/api/links/linkCount')
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.linkCounts).to.deep.include({
        [LinkStatus.PENDING]: 1,
      });
    });

    it('should return object of count by rejected status', async () => {
      await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.REJECTED,
      });

      const res = await request(app)
        .get('/api/links/linkCount')
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.linkCounts).to.deep.include({
        [LinkStatus.REJECTED]: 1,
      });
    });

    it('should return object of count by multiple statuses', async () => {
      await LinkRepository.updateLinkStatus({
        id: linkId,
        status: LinkStatus.REJECTED,
      });
      await LinkRepository.createLink('http://example.com/another-link');

      const res = await request(app)
        .get('/api/links/linkCount')
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.linkCounts).to.deep.include({
        [LinkStatus.REJECTED]: 1,
        [LinkStatus.PENDING]: 1,
      });
    });
  });
});
