import { expect } from 'chai';
import assert from 'assert';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewObjectId } from '@/testutils/mongoID.testutil';
import { differenceInSeconds } from 'date-fns';
import { ApplicationRepository } from '@/repositories/application.repository';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { IJobPosting, JobFilter } from '@/models/job-posting.model';
import { JobPostingRegion, JobFunction, JobType } from '@vtmp/common/constants';

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

  describe('getJobPostingsUserHasNotAppliedTo', () => {
    const userIdA = getNewMongoId();
    const userIdB = getNewMongoId();
    let jobPostings: (IJobPosting | undefined)[];
    const limit = 6;
    const totalJobPostings = 15;

    const mockMultipleJobPostings = Array.from(
      { length: totalJobPostings },
      (_, i) => ({
        linkId: getNewObjectId(),
        url: `http://example${i + 1}.com/job-posting`,
        jobTitle: `Software Engineer ${i + 1}`,
        companyName: `Example Company ${i + 1}`,
        submittedBy: getNewObjectId(),
      })
    );

    const randomRemoveJobPostings = async () => {
      const index = Math.floor(Math.random() * jobPostings.length);
      await JobPostingRepository.deleteJobPostingById(
        jobPostings[index]?._id.toString() || ''
      );
      jobPostings = jobPostings.filter((_, i) => i !== index);
    };

    const randomCreatApplications = async ({
      userId,
      numApplications,
    }: {
      userId: string;
      numApplications: number;
    }) => {
      for (let i = 0; i < numApplications; i++) {
        const index = Math.floor(Math.random() * jobPostings.length);
        await ApplicationRepository.createApplication({
          jobPostingId: jobPostings[index]?._id.toString() || '',
          userId: userId,
        });
        jobPostings = jobPostings.filter((_, i) => i !== index);
      }
    };

    const runPaginationTest = async ({
      userId,
      filters,
    }: {
      userId: string;
      filters?: JobFilter;
    }) => {
      let page = 1;
      let jobsNotAppliedByUser: IJobPosting[] = [];
      let cursor = undefined;
      const totalPage = Math.floor((totalJobPostings - 1) / limit) + 1;
      while (page <= totalPage) {
        jobsNotAppliedByUser =
          await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
            userId,
            limit,
            cursor,
            filters,
          });

        expect(jobsNotAppliedByUser)
          .to.be.an('array')
          .that.has.length(
            Math.min(totalJobPostings - limit * (page - 1), limit)
          );
        jobsNotAppliedByUser.forEach((job) => {
          assert(job);
        });
        expect(
          jobsNotAppliedByUser.map((job) => job._id?.toString())
        ).to.have.members(
          jobPostings
            .slice((page - 1) * limit, page * limit)
            .map((jobPosting) => jobPosting?._id.toString())
        );

        page += 1;
        cursor = {
          _id: String(
            jobsNotAppliedByUser[jobsNotAppliedByUser.length - 1]?._id
          ),
        };
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
            limit,
          });

        expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
      });

      it(`should return ${limit} job postings on page i/3 that matches all available job postings in the system if user has no applied to any posting`, async () => {
        runPaginationTest({ userId: userIdA });
      });

      it('should exclude soft-deleted job postings from the returned array', async () => {
        randomRemoveJobPostings();
        randomCreatApplications({ userId: userIdA, numApplications: 4 });

        runPaginationTest({ userId: userIdA });
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
            limit,
          });

        expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
        assert(jobsNotAppliedByUserA[0]);
        expect(jobsNotAppliedByUserA[0]._id?.toString()).to.equal(
          jobPostings[0]?.id
        );
      });

      it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
        randomRemoveJobPostings();

        randomCreatApplications({ userId: userIdA, numApplications: 4 });

        randomCreatApplications({ userId: userIdB, numApplications: 3 });

        runPaginationTest({ userId: userIdA });
        runPaginationTest({ userId: userIdB });
      });
    });

    describe('getJobPostingsUserHasNotAppliedTo with Filter', () => {
      const userIdA = getNewMongoId();
      const userIdB = getNewMongoId();
      const mockCompanyName = 'Company 1';
      const mockJobTitle = 'Engineer 2';
      const mockStartDate = new Date('2023-12-31');
      const mockEnDDate = new Date('2024-05-01');
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
            limit,
            filters: { companyName: mockCompanyName },
          });

        expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
      });

      it('should return only the job postings not applied by the user and matching the company name filters', async () => {
        runPaginationTest({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
        });
      });

      it('should returns job postings not applied by user after applying to one, matching the filters criteria', async () => {
        randomCreatApplications({ userId: userIdA, numApplications: 3 });

        runPaginationTest({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
        });
      });

      it('should returns job postings not applied by user after applying to one, matching the filters with date', async () => {
        runPaginationTest({
          userId: userIdA,
          filters: {
            postingDateRangeStart: mockStartDate,
            postingDateRangeEnd: mockEnDDate,
          },
        });
      });

      it('should return empty array when filters by field with no matching postings', async () => {
        runPaginationTest({
          userId: userIdA,
          filters: { jobTitle: mockTitle },
        });
      });

      it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
        randomCreatApplications({ userId: userIdA, numApplications: 3 });
        randomCreatApplications({ userId: userIdB, numApplications: 4 });
        runPaginationTest({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
        });
      });

      it('should return all job postings that user has not applied to  when filters by Job Tile, Company Name and Location ', async () => {
        runPaginationTest({
          userId: userIdA,
          filters: {
            companyName: mockCompanyName,
            jobTitle: mockJobTitle,
            location: JobPostingRegion.CANADA,
          },
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
            limit,
            filters: {
              companyName: 'Company 2',
              jobTitle: 'Engineer 2',
            },
          });

        expect(jobs).to.be.an('array').with.lengthOf(1);
        assert(jobs[0]);
        expect(jobs[0]?._id.toString()).to.equal(jobPosting2?.id);
      });

      it('should returns job postings not applied by user after applying to one, matching the filters with Job Function and Type', async () => {
        runPaginationTest({
          userId: userIdA,
          filters: {
            jobFunction: JobFunction.SOFTWARE_ENGINEER,
            jobType: JobType.INTERNSHIP,
          },
        });
      });
    });
  });
});
