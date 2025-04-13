import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { beforeEach, describe } from 'mocha';
import app from '@/app';
import * as chai from 'chai';
import request from 'supertest';
import { expect } from 'chai';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import {
  expectErrorsArray,
  expectSuccessfulResponse,
} from '@/testutils/response-assertion.testutil';
import { LinkRepository } from '@/repositories/link.repository';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import chaiSubset from 'chai-subset';

chai.use(chaiSubset);

describe('LinkController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

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
        .post(`/api/links/`)
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 400, errorsCount: 3 });
    });
  });

  describe('rejectLink', () => {
    it('should return error message for rejecting not exist link', async () => {
      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/reject`)
        .set('Accept', 'application/json');

      const errors = res.body.errors;

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(errors[0].message).to.equal('Link not found');
    });

    it('should return a rejected link', async () => {
      const res = await request(app)
        .post(`/api/links/${linkId}/reject`)
        .set('Accept', 'application/json');

      expect(res.body.data.url).to.equal(url);
      expect(res.body.message).to.equal('Link has been rejected!');
    });
  });

  describe('approveLink', () => {
    it('should return error message for approving with not exist link', async () => {
      const addInInfromation = {
        jobTitle: 'Software Engineer Intern',
        companyName: 'Example Company',
      };

      const res = await request(app)
        .post(`/api/links/${getNewMongoId()}/approve`)
        .send(addInInfromation)
        .set('Accept', 'application/json');

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
    });

    it('should return a approved link', async () => {
      const addInInfromation = {
        jobTitle: 'Software Engineer Intern',
        companyName: 'Example Company',
      };

      const res = await request(app)
        .post(`/api/links/${linkId}/approve`)
        .send(addInInfromation)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.message).to.equal('Link has been approved!');
      expect(res.body.data.url).to.equal(url);
    });
  });

  describe('getPendingLinks', () => {
    it('should return array of pending links', async () => {
      const res = await request(app)
        .get(`/api/links/`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.links[0].url).to.equal(url);
    });
  });
});
