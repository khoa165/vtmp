import { expect } from 'chai';
import { differenceInSeconds } from 'date-fns';

import assert from 'assert';

import {
  JobFunction,
  JobPostingRegion,
  JobPostingSortField,
  JobType,
  SortOrder,
} from '@vtmp/common/constants';

import { IJobPosting, JobPostingFilter } from '@/models/job-posting.model';
import { ApplicationRepository } from '@/repositories/application.repository';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';

describe('JobPostingRepository', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  describe('createJobPosting', () => {
    it('should be able to create a new job posting', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });

      expect(newJobPosting).to.deep.include(mockJobPosting);
    });
  });

  describe('getJobPostingById', () => {
    let newJobPosting: IJobPosting | undefined;
    beforeEach(async () => {
      newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
    });
    it('should be able to find a job post by id', async () => {
      assert(newJobPosting);

      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      assert(foundJobPosting);
      expect(foundJobPosting).to.deep.include(mockJobPosting);
    });

    it('should return null if trying to get soft-deleted job posting', async () => {
      assert(newJobPosting);

      await JobPostingRepository.deleteJobPostingById(newJobPosting.id);
      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      assert(!foundJobPosting);
    });
  });

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
    it('should be able to update detail of a job post by id', async () => {
      assert(newJobPosting);

      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      expect(updatedJobPosting).to.deep.include(newUpdate);
    });

    it('should return null if trying to update soft-deleted job posting', async () => {
      assert(newJobPosting);

      await JobPostingRepository.deleteJobPostingById(newJobPosting.id);
      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      assert(!updatedJobPosting);
    });
  });

  describe('deleteJobPostingById', () => {
    let newJobPosting: IJobPosting | undefined;
    beforeEach(async () => {
      newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
    });
    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      assert(newJobPosting);

      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        newJobPosting.id
      );

      assert(deletedJobPosting?.deletedAt);

      const timeDiff = differenceInSeconds(
        new Date(),
        deletedJobPosting.deletedAt
      );
      expect(timeDiff).to.lessThan(3);
    });

    it('should return null if trying to set a delete-timestamp for soft-deleted job posting', async () => {
      assert(newJobPosting);

      await JobPostingRepository.deleteJobPostingById(newJobPosting.id);

      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        newJobPosting.id
      );

      assert(!deletedJobPosting);
    });
  });

  describe.only('getJobPostingsUserHasNotAppliedTo', () => {
    const userIdA = getNewMongoId();
    const userIdB = getNewMongoId();
    let jobPostings: (IJobPosting | undefined)[];
    const limit = 10;
    const totalJobPostings = 153;

    const mockMultipleJobPostings = Array.from(
      { length: totalJobPostings },
      (_, i) => ({
        linkId: getNewObjectId(),
        url: `http://example${i + 1}.com/job-posting`,
        jobFunction: Object.values(JobFunction)[i % 4],
        jobTitle: `Software Engineer ${i % 2 === 0 ? 2 : 1}`,
        companyName: `Example Company ${(i % 3) + 1}`,
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
      let jobsNotAppliedByUser: IJobPosting[] = [];
      let cursor = undefined;
      const totalPage = Math.floor((allJobPostings.length - 1) / limit) + 1;

      while (page <= totalPage) {
        const paginationResult =
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId,
            filters: {
              ...filters,
              limit,
              cursor,
            },
          });
        jobsNotAppliedByUser = paginationResult.data;
        cursor = paginationResult.cursor;

        expect(jobsNotAppliedByUser)
          .to.be.an('array')
          .that.has.length(
            Math.min(allJobPostings.length - limit * (page - 1), limit)
          );
        jobsNotAppliedByUser.forEach((job) => {
          assert(job);
        });
        expect(
          jobsNotAppliedByUser.map((job) => job._id?.toString())
        ).to.deep.equal(
          allJobPostings
            .slice((page - 1) * limit, page * limit)
            .map((jobPosting) => jobPosting?._id.toString())
        );

        page += 1;
      }
    };

    describe('getJobPostingsUserHasNotAppliedTo no filter', () => {
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
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
            filters: { limit },
          });

        expect(jobsNotAppliedByUserA.data)
          .to.be.an('array')
          .that.have.lengthOf(0);
      });

      it(`should return ${limit} job postings on page i/3 that matches all available job postings in the system if user has no applied to any posting`, async () => {
        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostings || [],
        });
      });

      it('should exclude soft-deleted job postings from the returned array', async () => {
        await randomRemoveJobPostings();
        const jobPostingsA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 4,
        });

        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostingsA || [],
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
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
            filters: { limit },
          });

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
          numApplications: 600,
        });

        const jobPostingsB = await randomCreateApplications({
          userId: userIdB,
          numApplications: 3,
        });

        await runPaginationTest({
          userId: userIdA,
          allJobPostings: jobPostingsA,
        });
        await runPaginationTest({
          userId: userIdB,
          allJobPostings: jobPostingsB,
        });
      });
    });

    describe('getJobPostingsUserHasNotAppliedTo with Filter', () => {
      const userIdA = getNewMongoId();
      const userIdB = getNewMongoId();
      const mockCompanyName = 'Company 1';
      const mockJobTitle = 'Engineer 2';
      const mockStartDate = new Date('2023-12-31');
      const mockEndDate = new Date('2024-05-01');
      const mockTitle = 'PD';

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

        const jobsNotAppliedByUserA =
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
            filters: {
              limit,
              companyName: mockCompanyName,
            },
          });

        expect(jobsNotAppliedByUserA.data)
          .to.be.an('array')
          .that.have.lengthOf(0);
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

      it('should returns job postings not applied by user after applying to one, matching the filters criteria', async () => {
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

      it('should returns job postings not applied by user after applying to one, matching the filters with date', async () => {
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

      it('should return empty array when filters by field with no matching postings', async () => {
        await runPaginationTest({
          userId: userIdA,
          filters: { jobTitle: mockTitle },
          allJobPostings: jobPostings.filter((jobPosting) =>
            jobPosting?.jobTitle
              ?.toLowerCase()
              .includes(mockTitle.toLowerCase())
          ),
        });
      });

      it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
        const jobPostingA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 3,
        });
        await randomCreateApplications({
          userId: userIdB,
          numApplications: 4,
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

      it('should return all job postings that user has not applied to when filters by Job Tile, Company Name and Location ', async () => {
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

      it('should not exclude a job posting from the returned array, if the user applied to that job posting, but later deleted the application associated with it', async () => {
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

        const jobs =
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId: userIdA,
            filters: {
              limit,
              companyName: 'Company 2',
              jobTitle: 'Engineer 1',
            },
          });

        expect(jobs.data).to.be.an('array').with.lengthOf(1);
        assert(jobs.data[0]);
        expect(jobs.data[0]?._id.toString()).to.equal(jobPosting2?.id);
      });

      it('should returns job postings not applied by user after applying to one, matching the filters with Job Function and Type', async () => {
        const jobPostingA = await randomCreateApplications({
          userId: userIdA,
          numApplications: 1,
        });

        await runPaginationTest({
          userId: userIdA,
          filters: {
            jobFunction: JobFunction.SOFTWARE_ENGINEER,
            jobType: JobType.INTERNSHIP,
          },
          allJobPostings: jobPostingA.filter(
            (jobPosting) =>
              jobPosting?.jobFunction === JobFunction.SOFTWARE_ENGINEER &&
              jobPosting?.jobType === JobType.INTERNSHIP
          ),
        });
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
          filters,
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
  });
});
