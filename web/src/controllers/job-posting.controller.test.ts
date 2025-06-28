import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';
import request, { Response } from 'supertest';

import assert from 'assert';

import {
  JobFunction,
  JobPostingRegion,
  JobPostingSortField,
  SortOrder,
} from '@vtmp/common/constants';

import app from '@/app';
import { EnvConfig } from '@/config/env';
import { IJobPosting, JobPostingFilter } from '@/models/job-posting.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
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

describe('JobPostingController', () => {
  useMongoDB();
  const sandbox = useSandbox();
  let mockUserId: string, mockUserToken: string, mockAdminToken: string;
  const userIdB = getNewMongoId();
  const limit = 6;
  const totalJobPostings = 15;
  let jobPostings: (IJobPosting | undefined)[];
  const newJobPostingUpdate = {
    jobTitle: 'Senior Software Engineer',
    companyName: 'Updated Company',
    jobDescription: 'This is an updated job description.',
  };
  const mockMultipleJobPostings = Array.from(
    { length: totalJobPostings },
    (_, i) => ({
      linkId: getNewObjectId(),
      url: `http://example${i + 1}.com/job-posting`,
      jobTitle: `Software Engineer ${i % 2 === 0 ? 2 : 1}`,
      companyName: `Example Company ${i + 1}`,
      submittedBy: getNewObjectId(),
      location: Object.values(JobPostingRegion)[i % 2],
      datePosted: new Date(2023, 6, 31 + i / 2),
    })
  );

  const randomRemoveJobPostings = async () => {
    const index = Math.floor(Math.random() * jobPostings.length);
    await JobPostingRepository.deleteJobPostingById(
      jobPostings[index]?._id.toString() || ''
    );
    jobPostings = jobPostings.filter((_, i) => i !== index);
  };

  const randomCreateApplications = async ({
    userId,
    numApplications,
  }: {
    userId: string;
    numApplications: number;
  }) => {
    const shuffled = [...jobPostings].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numApplications);

    for (const job of selected) {
      await ApplicationRepository.createApplication({
        jobPostingId: job ? job._id.toString() : '',
        userId,
      });
    }

    const selectedIds = new Set(selected.map((job) => job?._id.toString()));

    const remaining = jobPostings.filter(
      (job) => !selectedIds.has(job?._id.toString())
    );

    return remaining;
  };

  const runPaginationTest = async ({
    mockUserToken,
    filters,
    allJobPostings = [],
  }: {
    mockUserToken: string;
    filters?: JobPostingFilter;
    allJobPostings: (IJobPosting | undefined)[];
  }) => {
    let page = 1;
    let cursor = undefined;
    const totalPage = Math.floor((allJobPostings.length - 1) / limit) + 1;
    let res: Response;
    while (page <= totalPage) {
      res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .query({ ...filters, cursor, limit })
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      assert(res.body);
      expect(res.body.data).to.have.property('data');
      expect(res.body.data.data)
        .to.be.an('array')
        .that.has.length(
          Math.min(allJobPostings.length - limit * (page - 1), limit)
        );
      res.body.data.data.forEach((job: IJobPosting) => {
        assert(job);
      });
      expect(
        res.body.data.data.map((job: IJobPosting) => job._id?.toString())
      ).to.have.members(
        allJobPostings
          .slice((page - 1) * limit, page * limit)
          .map((jobPosting) => jobPosting?._id.toString())
      );

      page += 1;
      cursor = res.body.data.cursor;
    }
  };

  beforeEach(async () => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
    ({ mockUserId, mockUserToken, mockAdminToken } = await runUserLogin());

    jobPostings = await Promise.all(
      mockMultipleJobPostings.map((jobPosting) =>
        JobPostingRepository.createJobPosting({
          jobPostingData: jobPosting,
        })
      )
    );
    assert(jobPostings);
  });

  describe('PUT /job-postings/:jobId', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/${getNewMongoId()}`,
      method: HTTPMethod.PUT,
    });

    it('should throw ForbiddenError when user try to update job posting', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should return 400 for invalid job posting ID format', async () => {
      const res = await request(app)
        .put('/api/job-postings/invalid-id')
        .send({ jobTitle: 'Invalid Test' })
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid job posting ID format'
      );
    });

    it('should return 400 for invalid job title type', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send({ jobTitle: 123 })
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Invalid job title format');
    });

    it('should return 400 for field not allow to update', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send({ userId: 'test' })
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'field is not allowed to update'
      );
    });

    it('should return error message for no job posting found', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${getNewMongoId()}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Job posting not found');
    });

    it('should return a updated job posting', async () => {
      const res = await request(app)
        .put(`/api/job-postings/${jobPostings[0]?.id}`)
        .send(newJobPostingUpdate)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.deep.include(newJobPostingUpdate);
    });
  });

  describe('DELETE /job-postings/:jobId', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/${getNewMongoId()}`,
      method: HTTPMethod.DELETE,
    });

    it('should throw ForbiddenError when user try to delete job posting', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${jobPostings[0]?.id}`)
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectErrorsArray({ res, statusCode: 403, errorsCount: 1 });
      expect(res.body.errors[0].message).to.eq('Forbidden');
    });

    it('should return 401 if no auth token is provided', async () => {
      const res = await request(app).delete(
        `/api/job-postings/${jobPostings[0]?.id}`
      );

      expectErrorsArray({ res, statusCode: 401, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Unauthorized');
    });

    it('should return 400 for invalid job posting ID format', async () => {
      const res = await request(app)
        .delete('/api/job-postings/invalid-id-format')
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 400, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal(
        'Invalid job posting ID format'
      );
    });

    it('should return 404 if job posting was already deleted', async () => {
      await request(app)
        .delete(`/api/job-postings/${jobPostings[1]?.id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      const res = await request(app)
        .delete(`/api/job-postings/${jobPostings[1]?.id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Job posting not found');
    });

    it('should return an error message for no job posting found', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${getNewMongoId()}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectErrorsArray({ res, statusCode: 404, errorsCount: 1 });
      expect(res.body.errors[0].message).to.equal('Job posting not found');
    });

    it('should return a deleted job posting', async () => {
      const res = await request(app)
        .delete(`/api/job-postings/${jobPostings[0]?.id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data).to.have.property('deletedAt');

      const deletedJobPosting = res.body.data;
      const timeDiff = differenceInSeconds(
        deletedJobPosting.deletedAt,
        new Date()
      );
      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('GET /job-postings/not-applied', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/not-applies`,
      method: HTTPMethod.GET,
    });

    it('should return an empty array if user has applied to all available job postings in the system', async () => {
      await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: mockUserId,
          })
        )
      );

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return all job postings if user has not applied to any posting', async () => {
      await runPaginationTest({ mockUserToken, allJobPostings: jobPostings });
    });

    it('should exclude soft-deleted job postings from the returned array', async () => {
      await randomRemoveJobPostings();
      const jobPostingA = await randomCreateApplications({
        userId: mockUserId,
        numApplications: 4,
      });

      await runPaginationTest({ mockUserToken, allJobPostings: jobPostingA });
    });

    it('should not exclude a job posting if the user applied to it but later deleted the application', async () => {
      const applications = await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: mockUserId,
          })
        )
      );
      await ApplicationRepository.deleteApplicationById({
        applicationId: applications[0]?.id,
        userId: mockUserId,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .set('Accept', 'application/json')
        .query({ limit })
        .set('Authorization', `Bearer ${mockUserToken}`);

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data.data[0]._id).to.equal(jobPostings[0]?.id);
    });

    it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
      await randomRemoveJobPostings();

      const jobPostingsA = await randomCreateApplications({
        userId: mockUserId,
        numApplications: 4,
      });

      await randomCreateApplications({
        userId: userIdB,
        numApplications: 3,
      });

      await runPaginationTest({
        mockUserToken,
        allJobPostings: jobPostingsA,
      });
    });
  });

  describe('GET /job-postings/not-applied with Filter', () => {
    runDefaultAuthMiddlewareTests({
      route: `/api/job-postings/not-applied`,
      method: HTTPMethod.GET,
      body: {},
    });

    it('should return an empty array if user has applied to all available job postings in the system', async () => {
      const mockCompany = 'Company';
      await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: mockUserId,
          })
        )
      );

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({ companyName: mockCompany })
        .set('Authorization', `Bearer ${mockUserToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return only the job postings not applied by the user and matching the company name filter', async () => {
      const mockCompany = 'Company 1';
      await runPaginationTest({
        mockUserToken,
        filters: { companyName: mockCompany },
        allJobPostings: jobPostings.filter((jobPosting) =>
          jobPosting?.companyName
            ?.toLowerCase()
            .includes(mockCompany.toLowerCase())
        ),
      });
    });

    it('should return job postings not applied by user after applying to one, matching the filter criteria', async () => {
      const mockCompany = 'Company 1';
      const jobPostingA = await randomCreateApplications({
        userId: mockUserId,
        numApplications: 4,
      });

      await runPaginationTest({
        mockUserToken,
        allJobPostings: jobPostingA.filter((jobPosting) =>
          jobPosting?.companyName
            ?.toLowerCase()
            .includes(mockCompany.toLowerCase())
        ),
        filters: { companyName: mockCompany },
      });
    });

    it('should return job postings matching the date filter', async () => {
      const mockStartDate = new Date('2023-12-31');
      const mockEndDate = new Date('2025-1-1');

      await runPaginationTest({
        mockUserToken,
        filters: {
          postingDateRangeStart: mockStartDate,
          postingDateRangeEnd: mockEndDate,
        },
        allJobPostings: jobPostings.filter(
          (jobPosting) =>
            jobPosting?.datePosted &&
            jobPosting?.datePosted >= mockStartDate &&
            jobPosting?.datePosted <= mockEndDate
        ),
      });
    });

    it('should return an empty array when filter by field with no matching postings', async () => {
      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({ companyName: 'PD' })
        .set('Authorization', `Bearer ${mockUserToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.data).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return job postings matching jobTitle, companyName, and location', async () => {
      const mockCompany = 'Company 1';
      const mockJobTitle = 'Engineer 2';

      await runPaginationTest({
        mockUserToken,
        filters: {
          companyName: mockCompany,
          jobTitle: mockJobTitle,
          location: JobPostingRegion.US,
        },
        allJobPostings: jobPostings.filter(
          (jobPosting) =>
            jobPosting?.companyName
              .toLowerCase()
              .includes(mockCompany.toLowerCase()) &&
            jobPosting?.jobTitle
              .toLowerCase()
              .includes(mockJobTitle.toLowerCase()) &&
            jobPosting?.location === JobPostingRegion.US
        ),
      });
    });

    it('should return job posting if user deleted the application', async () => {
      const mockCompany = 'Company 2';
      const jobPosting2 = jobPostings[1];
      const applications = await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: mockUserId,
          })
        )
      );
      await ApplicationRepository.deleteApplicationById({
        applicationId: applications[1]?.id,
        userId: mockUserId,
      });

      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({
          companyName: mockCompany,
        })
        .set('Authorization', `Bearer ${mockUserToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.data).to.be.an('array').that.have.lengthOf(1);
      expect(res.body.data.data[0]._id).to.equal(jobPosting2?.id);
    });
  });

  describe('getJobPostingsUserHasNotAppliedTo with Pagination and Sort', () => {
    const mockCompanyName = 'Company 1';
    const mockJobTitle = 'Engineer 2';
    const mockStartDate = new Date('2023-12-31');
    const mockEndDate = new Date('2024-05-01');

    const runHelperPaginationWithSort = async ({
      mockUserToken,
      filters,
      allJobPostings = [],
      sortField,
    }: {
      mockUserToken: string;
      filters?: JobPostingFilter;
      allJobPostings: (IJobPosting | undefined)[];
      sortField: JobPostingSortField;
    }) => {
      const allJobPostingsSorted = [...allJobPostings]
        .filter(Boolean)
        .sort((a, b) => {
          const aVal = a?.[sortField];
          const bVal = b?.[sortField];

          if (aVal === undefined && bVal === undefined) return 0;
          if (aVal === undefined) return -1;
          if (bVal === undefined) return 1;

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            const cmp = aVal.localeCompare(bVal);
            if (cmp !== 0) return cmp;
          }

          if (aVal instanceof Date && bVal instanceof Date) {
            const cmp = aVal.getTime() - bVal.getTime();
            if (cmp !== 0) return cmp;
          }

          const aId = a?._id?.toString() ?? '';
          const bId = b?._id?.toString() ?? '';
          return aId.localeCompare(bId);
        });

      await runPaginationTest({
        mockUserToken,
        filters,
        allJobPostings: allJobPostingsSorted,
      });
    };

    it(`should return empty array if not match any filters`, async () => {
      const res = await request(app)
        .get('/api/job-postings/not-applied')
        .query({
          companyName: 'PD',
          sortField: JobPostingSortField.JOB_TYPE,
          sortOrder: SortOrder.ASC,
        })
        .set('Authorization', `Bearer ${mockUserToken}`)
        .set('Accept', 'application/json');

      expectSuccessfulResponse({ res, statusCode: 200 });
      expect(res.body.data.data).to.be.an('array').that.have.lengthOf(0);
    });

    Object.values(JobPostingSortField).forEach((sortField) => {
      it(`should return pages with correct sorting on ${sortField}`, async () => {
        await runHelperPaginationWithSort({
          mockUserToken,
          sortField: sortField,
          filters: {
            limit,
            sortField,
            sortOrder: SortOrder.ASC,
          },
          allJobPostings: jobPostings,
        });
      });

      it(`should return pages with correct sorting on ${sortField} after deleting some job postings`, async () => {
        await randomRemoveJobPostings();
        await randomRemoveJobPostings();
        await runHelperPaginationWithSort({
          mockUserToken,
          sortField: sortField,
          filters: {
            limit,
            sortField,
            sortOrder: SortOrder.ASC,
          },
          allJobPostings: jobPostings,
        });
      });

      it(`should return pages with correct sorting on ${sortField} after deleting some job postings and user creats some applications`, async () => {
        await randomRemoveJobPostings();
        await randomRemoveJobPostings();
        jobPostings = await randomCreateApplications({
          userId: mockUserId,
          numApplications: 3,
        });
        await runHelperPaginationWithSort({
          mockUserToken,
          sortField: sortField,
          filters: {
            limit,
            sortField,
            sortOrder: SortOrder.ASC,
          },
          allJobPostings: jobPostings,
        });
      });

      it(`should return pages with correct sorting on ${sortField} after user creats some applications without excluding other users' applications`, async () => {
        await randomRemoveJobPostings();
        await randomRemoveJobPostings();
        const jobPostingsA = await randomCreateApplications({
          userId: mockUserId,
          numApplications: 3,
        });

        await randomCreateApplications({
          userId: userIdB,
          numApplications: 4,
        });

        await runHelperPaginationWithSort({
          mockUserToken,
          sortField: sortField,
          filters: {
            limit,
            sortField,
            sortOrder: SortOrder.ASC,
          },
          allJobPostings: jobPostingsA,
        });
      });

      const filtersOptions = {
        companyName: mockCompanyName,
        jobTitle: mockJobTitle,
        location: JobPostingRegion.US,
        jobFunction: JobFunction.SOFTWARE_ENGINEER,
      };

      Object.entries(filtersOptions).forEach(([filterName, filterValue]) => {
        const key = filterName as keyof IJobPosting;

        it(`should return only the job postings not applied by the user and matching the ${filterName} filters`, async () => {
          await runHelperPaginationWithSort({
            mockUserToken,
            sortField: sortField,
            filters: {
              limit,
              sortField,
              [key]: filterValue,
            },
            allJobPostings: jobPostings.filter((jobPosting) =>
              jobPosting?.[key]
                ?.toLowerCase()
                .includes(filterValue.toLowerCase())
            ),
          });
        });
      });

      it('should returns job postings not applied by user after applying to one, matching the filters with date', async () => {
        await runHelperPaginationWithSort({
          mockUserToken,
          sortField: sortField,
          filters: {
            limit,
            sortField,
            postingDateRangeStart: mockStartDate,
            postingDateRangeEnd: mockEndDate,
          },
          allJobPostings: jobPostings.filter(
            (jobPosting) =>
              jobPosting?.datePosted &&
              jobPosting?.datePosted >= mockStartDate &&
              jobPosting?.datePosted <= mockEndDate
          ),
        });
      });
    });
  });
});
