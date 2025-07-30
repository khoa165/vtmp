import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import assert from 'assert';

import {
  JobFunction,
  JobPostingRegion,
  JobPostingSortField,
  SortOrder,
} from '@vtmp/common/constants';

import { EnvConfig } from '@/config/env';
import { IJobPosting, JobPostingFilter } from '@/models/job-posting.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { JobPostingService } from '@/services/job-posting.service';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { ResourceNotFoundError } from '@/utils/errors';

describe('JobPostingService', () => {
  useMongoDB();
  const sandbox = useSandbox();
  beforeEach(() => {
    sandbox.stub(EnvConfig, 'get').returns(MOCK_ENV);
  });

  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  describe('updateJobPostingById', () => {
    let newJobPosting: IJobPosting | undefined;
    const newUpdate = {
      jobTitle: 'Senior Software Engineer',
      companyName: 'Updated Company',
      jobDescription: 'This is an updated job description.',
    };
    beforeEach(async () => {
      newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
    });
    it('should throw an error when no job posting is found', async () => {
      await expect(
        JobPostingService.updateJobPostingById(getNewMongoId(), newUpdate)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should be able to update detail of a job post by id', async () => {
      assert(newJobPosting);

      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      expect(updatedJobPosting).to.deep.include(newUpdate);
    });

    it('should not throw an error when a job posting is found', async () => {
      assert(newJobPosting);

      await expect(
        JobPostingService.updateJobPostingById(newJobPosting.id, newUpdate)
      ).eventually.fulfilled;
    });
  });

  describe('deleteJobPostingById', () => {
    let newJobPosting: IJobPosting | undefined;
    beforeEach(async () => {
      newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
    });
    it('should throw an error when no job posting is found', async () => {
      await expect(
        JobPostingService.deleteJobPostingById(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when a job posting is found', async () => {
      assert(newJobPosting);

      await expect(JobPostingService.deleteJobPostingById(newJobPosting.id))
        .eventually.fulfilled;
    });

    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      assert(newJobPosting);

      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        newJobPosting.id
      );

      assert(deletedJobPosting);
      assert(deletedJobPosting.deletedAt);

      const timeDiff = differenceInSeconds(
        new Date(),
        deletedJobPosting.deletedAt
      );

      expect(timeDiff).to.lessThan(3);
    });
  });

  describe('getJobPostingsUserHasNotAppliedTo', () => {
    const userIdA = getNewMongoId();
    const userIdB = getNewMongoId();
    let jobPostings: (IJobPosting | undefined)[];
    const limit = 6;
    const totalJobPostings = 153;

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
      userId,
      filters,
      allJobPostings = [],
    }: {
      userId: string;
      filters?: JobPostingFilter;
      allJobPostings: (IJobPosting | undefined)[];
    }) => {
      let page = 1;
      let jobsNotAppliedByUser;
      let cursor = undefined;
      const totalPage = Math.floor((allJobPostings.length - 1) / limit) + 1;

      while (page <= totalPage) {
        jobsNotAppliedByUser =
          await JobPostingService.getJobPostingsUserHasNotAppliedTo({
            userId,
            filters: {
              ...filters,
              limit,
              ...(cursor !== undefined && { cursor }),
            },
          });

        assert(jobsNotAppliedByUser);
        expect(jobsNotAppliedByUser).to.have.property('data');
        expect(jobsNotAppliedByUser).to.have.property('cursor');
        expect(jobsNotAppliedByUser.data)
          .to.be.an('array')
          .that.has.length(
            Math.min(allJobPostings.length - limit * (page - 1), limit)
          );
        jobsNotAppliedByUser.data.forEach((job) => {
          assert(job);
        });
        expect(
          jobsNotAppliedByUser.data.map((job) => job._id?.toString())
        ).to.have.members(
          allJobPostings
            .slice((page - 1) * limit, page * limit)
            .map((jobPosting) => jobPosting?._id.toString())
        );

        page += 1;
        cursor = jobsNotAppliedByUser.cursor;
      }
    };

    describe('getJobPostingsUserHasNotAppliedTo Without Filter', () => {
      beforeEach(async () => {
        jobPostings = await Promise.all(
          mockMultipleJobPostings.map((jobPosting) =>
            JobPostingRepository.createJobPosting({
              jobPostingData: jobPosting,
            })
          )
        );
      });

      it('should return an empty array if user has applied to all avaialble job postings in the system', async () => {
        await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting?.id,
              userId: userIdA,
            })
          )
        );
        const jobsNotAppliedByUserA =
          await JobPostingService.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
            filters: { limit },
          });

        assert(jobsNotAppliedByUserA);
        expect(jobsNotAppliedByUserA).to.have.property('data');
        expect(jobsNotAppliedByUserA).to.have.property('cursor');
        expect(jobsNotAppliedByUserA.data)
          .to.be.an('array')
          .that.have.lengthOf(0);
        expect(jobsNotAppliedByUserA.cursor).to.eq(undefined);
      });

      it('should return an exact array of job postings that matches all available job postings in the system if user has no applied to any posting', async () => {
        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostings,
        });
      });

      it('should exclude soft-deleted job postings from the returned array', async () => {
        await randomRemoveJobPostings();
        const jobPostingA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 4,
        });

        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostingA,
          filters: { sortOrder: SortOrder.ASC },
        });
      });

      it('should not exclude a job posting from the returned array, if the user applied to that job posting, but later deleted the application associated with it', async () => {
        const applications = await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting?.id,
              userId: userIdA,
            })
          )
        );
        await ApplicationRepository.deleteApplicationById({
          applicationId: applications[0]?.id,
          userId: userIdA,
        });
        const jobsNotAppliedByUserA =
          await JobPostingService.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
          });

        assert(jobsNotAppliedByUserA);
        expect(jobsNotAppliedByUserA).to.have.property('data');
        expect(jobsNotAppliedByUserA).to.have.property('cursor');
        expect(jobsNotAppliedByUserA.data)
          .to.be.an('array')
          .that.have.lengthOf(1);
        assert(jobsNotAppliedByUserA.data[0]);
        expect(jobsNotAppliedByUserA.data[0]._id?.toString()).to.equal(
          jobPostings[0]?.id
        );
      });

      it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
        await randomRemoveJobPostings();

        const jobPostingsA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 4,
        });

        const jobPostingsB = await randomCreateApplications({
          userId: userIdB,
          numApplications: 3,
        });

        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostingsA,
          filters: { sortOrder: SortOrder.ASC },
        });

        await runPaginationTest({
          userId: userIdB,
          allJobPostings: jobPostingsB,
          filters: { sortOrder: SortOrder.ASC },
        });
      });
    });

    describe('getJobPostingsUserHasNotAppliedTo With Filter', () => {
      const mockCompanyName = 'Company 1';
      const mockJobTitle = 'Engineer 2';
      const mockStartDate = new Date('2023-12-31');
      const mockEndDate = new Date('2025-1-1');

      beforeEach(async () => {
        jobPostings = await Promise.all(
          mockMultipleJobPostings.map((jobPosting) =>
            JobPostingRepository.createJobPosting({
              jobPostingData: jobPosting,
            })
          )
        );
      });

      it('should return an empty array when the user has already applied to all filtered job postings', async () => {
        await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting?.id,
              userId: userIdA,
            })
          )
        );

        const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: {
            companyName: mockCompanyName,
          },
        });

        assert(jobs);
        expect(jobs).to.have.property('data');
        expect(jobs).to.have.property('cursor');
        expect(jobs.data).to.be.an('array').that.has.lengthOf(0);
        expect(jobs.cursor).to.eq(undefined);
      });

      it('should return only the job postings not applied by the user and matching the company name filters', async () => {
        await runPaginationTest({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
          allJobPostings: jobPostings.filter((jobPosting) =>
            jobPosting?.companyName
              ?.toLowerCase()
              .includes(mockCompanyName.toLowerCase())
          ),
        });
      });

      it('should return job postings not applied by user after applying to one, matching the filters criteria', async () => {
        const jobPostingA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 3,
        });

        await runPaginationTest({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
          allJobPostings: jobPostingA.filter((jobPosting) =>
            jobPosting?.companyName
              ?.toLowerCase()
              .includes(mockCompanyName.toLowerCase())
          ),
        });
      });

      it('should return job postings matching the date filters', async () => {
        await runPaginationTest({
          userId: userIdA,
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

      it('should return an empty array when filters by field with no matching postings', async () => {
        const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: {
            jobTitle: 'PD',
          },
        });

        expect(jobs.data).to.be.an('array').that.has.lengthOf(0);
      });

      it('should not exclude job postings applied by another user', async () => {
        await randomRemoveJobPostings();

        const jobPostingsA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 4,
        });

        const jobPostingsB = await randomCreateApplications({
          userId: userIdB,
          numApplications: 3,
        });

        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostingsA.filter((jobPosting) =>
            jobPosting?.companyName
              ?.toLowerCase()
              .includes(mockCompanyName.toLowerCase())
          ),
          filters: { companyName: mockCompanyName },
        });
        await runPaginationTest({
          userId: userIdB,
          allJobPostings: jobPostingsB.filter((jobPosting) =>
            jobPosting?.companyName
              ?.toLowerCase()
              .includes(mockCompanyName.toLowerCase())
          ),
          filters: { companyName: mockCompanyName },
        });
      });

      it('should return job postings matching jobTitle, companyName, and location', async () => {
        await runPaginationTest({
          userId: userIdA,
          filters: {
            companyName: mockCompanyName,
            jobTitle: mockJobTitle,
            location: JobPostingRegion.US,
          },
          allJobPostings: jobPostings.filter(
            (jobPosting) =>
              jobPosting?.companyName
                .toLowerCase()
                .includes(mockCompanyName.toLowerCase()) &&
              jobPosting?.jobTitle
                .toLowerCase()
                .includes(mockJobTitle.toLowerCase()) &&
              jobPosting?.location === JobPostingRegion.US
          ),
        });
      });

      it('should return job posting if user deleted the application', async () => {
        const [, jobPosting2] = jobPostings;
        const applications = await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting?.id,
              userId: userIdA,
            })
          )
        );

        await ApplicationRepository.deleteApplicationById({
          applicationId: applications[1]?.id,
          userId: userIdA,
        });

        const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: {
            companyName: 'Company 2',
            jobTitle: 'Engineer 1',
          },
        });
        assert(jobs);
        expect(jobs).to.have.property('data');
        expect(jobs).to.have.property('cursor');
        expect(jobs.data).to.be.an('array').that.has.lengthOf(1);
        expect(jobs.data[0]?._id.toString()).to.equal(jobPosting2?.id);
      });
    });

    describe('getJobPostingsUserHasNotAppliedTo with Pagination and Sort', () => {
      const mockCompanyName = 'Company 1';
      const mockJobTitle = 'Engineer 2';
      const mockStartDate = new Date('2023-12-31');
      const mockEndDate = new Date('2024-05-01');

      const runHelperPaginationWithSort = async ({
        userId,
        filters,
        allJobPostings = [],
        sortField,
      }: {
        userId: string;
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
          userId: userId,
          ...(filters !== undefined && { filters }),
          allJobPostings: allJobPostingsSorted,
        });
      };

      beforeEach(async () => {
        jobPostings = await Promise.all(
          mockMultipleJobPostings.map((jobPosting) =>
            JobPostingRepository.createJobPosting({
              jobPostingData: jobPosting,
            })
          )
        );
      });

      it(`should return empty array if not match any filters`, async () => {
        const jobsNotAppliedByUserA =
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
            filters: {
              limit,
              companyName: 'Does not exist',
            },
          });

        expect(jobsNotAppliedByUserA.data)
          .to.be.an('array')
          .that.have.lengthOf(0);
      });

      Object.values(JobPostingSortField).forEach((sortField) => {
        it(`should return pages with correct sorting on ${sortField}`, async () => {
          await runHelperPaginationWithSort({
            userId: userIdA,
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
            userId: userIdA,
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
            userId: userIdA,
            numApplications: 3,
          });
          await runHelperPaginationWithSort({
            userId: userIdA,
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
            userId: userIdA,
            numApplications: 3,
          });

          const jobPostingsB = await randomCreateApplications({
            userId: userIdB,
            numApplications: 4,
          });

          await runHelperPaginationWithSort({
            userId: userIdA,
            sortField: sortField,
            filters: {
              limit,
              sortField,
              sortOrder: SortOrder.ASC,
            },
            allJobPostings: jobPostingsA,
          });

          await runHelperPaginationWithSort({
            userId: userIdB,
            sortField: sortField,
            filters: {
              limit,
              sortField,
              sortOrder: SortOrder.ASC,
            },
            allJobPostings: jobPostingsB,
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
              userId: userIdA,
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
            userId: userIdA,
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

    describe('getJobPostingsUserNotAppliedToCount', () => {
      beforeEach(async () => {
        jobPostings = await Promise.all(
          mockMultipleJobPostings.map((jobPosting) =>
            JobPostingRepository.createJobPosting({
              jobPostingData: jobPosting,
            })
          )
        );
      });

      it('should return 0 if there is no job postings that match the filters', async () => {
        const count =
          await JobPostingService.getJobPostingsUserNotAppliedToCount({
            userId: userIdA,
            filters: { companyName: 'Nonexistent Company' },
          });

        expect(count).to.equal(0);
      });

      it('should return 0 count if user has applied to all avaialble job postings in the system', async () => {
        await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting?.id,
              userId: userIdA,
            })
          )
        );

        const count =
          await JobPostingService.getJobPostingsUserNotAppliedToCount({
            userId: userIdA,
            filters: {},
          });

        expect(count).to.equal(0);
      });

      it('should return 0 count if user has applied to all avaialble job postings in the system with filter', async () => {
        await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting?.id,
              userId: userIdA,
            })
          )
        );

        assert(jobPostings[0]);

        const count =
          await JobPostingService.getJobPostingsUserNotAppliedToCount({
            userId: userIdA,
            filters: { companyName: jobPostings[0].companyName },
          });

        expect(count).to.equal(0);
      });

      it('should return count of job postings if user has not applied to any', async () => {
        const appliedApplications = 3;

        await randomCreateApplications({
          userId: userIdA,
          numApplications: appliedApplications,
        });

        const count =
          await JobPostingService.getJobPostingsUserNotAppliedToCount({
            userId: userIdA,
            filters: {},
          });

        expect(count).to.equal(jobPostings.length - appliedApplications);
      });

      it('should return count of job postings user has not applied to with filters', async () => {
        const end = new Date();
        const start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 30);

        const appliedApplications = await Promise.all(
          jobPostings.map((jobPosting) => {
            assert(jobPosting && jobPosting.datePosted);
            const date = new Date(jobPosting.datePosted);
            if (date >= start && date <= end) {
              ApplicationRepository.createApplication({
                jobPostingId: jobPosting?.id,
                userId: userIdA,
              });
            }
          })
        );

        const count =
          await JobPostingService.getJobPostingsUserNotAppliedToCount({
            userId: userIdA,
            filters: {
              postingDateRangeStart: start,
              postingDateRangeEnd: end,
            },
          });

        expect(count).to.equal(jobPostings.length - appliedApplications.length);
      });
    });
  });
});
