import { expect } from 'chai';
import assert from 'assert';
import { JobPostingService } from '@/services/job-posting.service';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationRepository } from '@/repositories/application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { ResourceNotFoundError } from '@/utils/errors';
import { differenceInSeconds } from 'date-fns';
import { IJobPosting, JobFilter } from '@/models/job-posting.model';
import { JobPostingRegion } from '@vtmp/common/constants';
import { useSandbox } from '@/testutils/sandbox.testutil';
import { EnvConfig } from '@/config/env';
import { MOCK_ENV } from '@/testutils/mock-data.testutil';
import { JWTUtils } from '@vtmp/server-common/utils';
import z from 'zod';
import jwt from 'jsonwebtoken';

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

    beforeEach(async () => {
      jobPostings = await Promise.all(
        mockMultipleJobPostings.map((jobPosting) =>
          JobPostingRepository.createJobPosting({
            jobPostingData: jobPosting,
          })
        )
      );
    });

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
      let cursor = undefined;
      const totalPage = Math.floor((jobPostings.length - 1) / limit) + 1;

      while (page <= totalPage) {
        const jobsNotAppliedByUser =
          await JobPostingService.getJobPostingsUserHasNotAppliedTo({
            userId,
            filters,
            pagination: { limit, cursor },
          });
        console.log('Page: ', page);
        expect(jobsNotAppliedByUser).to.have.property('data');
        expect(jobsNotAppliedByUser).to.have.property('cursor');
        expect(jobsNotAppliedByUser.data)
          .to.be.an('array')
          .that.has.length(
            Math.min(jobPostings.length - limit * (page - 1), limit)
          );
        jobsNotAppliedByUser.data.forEach((job) => {
          assert(job);
        });
        expect(
          jobsNotAppliedByUser.data.map((job) => job._id?.toString())
        ).to.have.members(
          jobPostings
            .slice((page - 1) * limit, page * limit)
            .map((jobPosting) => jobPosting?._id.toString())
        );

        page += 1;
        cursor = jobsNotAppliedByUser.cursor;
      }
    };

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
          pagination: { limit },
        });

      assert(jobsNotAppliedByUserA);
      expect(jobsNotAppliedByUserA).to.have.property('data');
      expect(jobsNotAppliedByUserA).to.have.property('cursor');
      expect(jobsNotAppliedByUserA.data)
        .to.be.an('array')
        .that.have.lengthOf(0);
      expect(jobsNotAppliedByUserA.cursor).to.eq(null);
    });

    it('should return an exact array of job postings that matches all available job postings in the system if user has no applied to any posting', async () => {
      await runPaginationTest({ userId: userIdA });
    });

    it('should exclude soft-deleted job postings from the returned array', async () => {
      // const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      // await ApplicationRepository.createApplication({
      //   jobPostingId: jobPosting1?.id,
      //   userId: userIdA,
      // });
      // await ApplicationRepository.createApplication({
      //   jobPostingId: jobPosting2?.id,
      //   userId: userIdA,
      // });
      // await JobPostingRepository.deleteJobPostingById(jobPosting3?.id);
      // jobPostings = jobPostings.slice[4:]?
      // const jobsNotAppliedByUserA =
      //   await JobPostingService.getJobPostingsUserHasNotAppliedTo({
      //     userId: userIdA,
      //   });

      // expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
      // assert(jobsNotAppliedByUserA[0]);
      // expect(jobsNotAppliedByUserA[0]._id?.toString()).to.equal(
      //   jobPosting4?.id
      // );

      await randomRemoveJobPostings();
      await randomCreatApplications({ userId: userIdA, numApplications: 4 });

      await runPaginationTest({ userId: userIdA });
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

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
      assert(jobsNotAppliedByUserA[0]);
      expect(jobsNotAppliedByUserA[0]._id?.toString()).to.equal(
        jobPostings[0]?.id
      );
    });

    it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
      // const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      // await ApplicationRepository.createApplication({
      //   jobPostingId: jobPosting1?.id,
      //   userId: userIdA,
      // });
      // await ApplicationRepository.createApplication({
      //   jobPostingId: jobPosting2?.id,
      //   userId: userIdA,
      // });
      // await ApplicationRepository.createApplication({
      //   jobPostingId: jobPosting3?.id,
      //   userId: userIdB,
      // });
      // const jobsNotAppliedByUserA =
      //   await JobPostingService.getJobPostingsUserHasNotAppliedTo({
      //     userId: userIdA,
      //   });

      // expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(2);
      // expect(
      //   jobsNotAppliedByUserA.map((job) => job._id?.toString())
      // ).to.have.members([jobPosting3?.id, jobPosting4?.id]);
      await randomCreatApplications({ userId: userIdA, numApplications: 4 });
      await randomCreatApplications({ userId: userIdB, numApplications: 5 });
      await runPaginationTest({ userId: userIdA });
    });
  });

  // describe('getJobPostingsUserHasNotAppliedTo With Filter', () => {
  //   const userIdA = getNewMongoId();
  //   const userIdB = getNewMongoId();
  //   const mockCompanyName = 'Company 1';
  //   const mockJobTitle = 'Engineer 2';
  //   const mockStartDate = new Date('2023-12-31');
  //   const mockEndDate = new Date('2025-1-1');
  //   let jobPostings: (IJobPosting | undefined)[];

  //   const mockMultipleJobPostings = [
  //     {
  //       linkId: getNewObjectId(),
  //       url: 'http://example1.com/job-posting',
  //       jobTitle: 'Software Engineer 1',
  //       companyName: 'Example Company 1',
  //       submittedBy: getNewObjectId(),
  //     },
  //     {
  //       linkId: getNewObjectId(),
  //       url: 'http://example2.com/job-posting',
  //       jobTitle: 'Software Engineer 2',
  //       companyName: 'Example Company 1',
  //       submittedBy: getNewObjectId(),
  //       location: JobPostingRegion.CANADA,
  //     },
  //     {
  //       linkId: getNewObjectId(),
  //       url: 'http://example3.com/job-posting',
  //       jobTitle: 'Software Engineer 3',
  //       companyName: 'Example Company 3',
  //       submittedBy: getNewObjectId(),
  //       datePosted: new Date('2024-05-01'),
  //     },
  //     {
  //       linkId: getNewObjectId(),
  //       url: 'http://example4.com/job-posting',
  //       jobTitle: 'Software Engineer 4',
  //       companyName: 'Example Company 4',
  //       submittedBy: getNewObjectId(),
  //       datePosted: new Date('2023-7-31'),
  //     },
  //   ];

  //   beforeEach(async () => {
  //     jobPostings = await Promise.all(
  //       mockMultipleJobPostings.map((jobPosting) =>
  //         JobPostingRepository.createJobPosting({ jobPostingData: jobPosting })
  //       )
  //     );
  //   });

  //   it('should return an empty array when the user has already applied to all filtered job postings', async () => {
  //     await Promise.all(
  //       jobPostings.map((jobPosting) =>
  //         ApplicationRepository.createApplication({
  //           jobPostingId: jobPosting?.id,
  //           userId: userIdA,
  //         })
  //       )
  //     );

  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         companyName: mockCompanyName,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(0);
  //   });

  //   it('should return only the job postings not applied by the user and matching the company name filters', async () => {
  //     const [jobPosting1, jobPosting2] = jobPostings;
  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         companyName: mockCompanyName,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(2);
  //     expect(jobs.map((job) => job._id?.toString())).to.have.members([
  //       jobPosting1?.id,
  //       jobPosting2?.id,
  //     ]);
  //   });

  //   it('should return job postings not applied by user after applying to one, matching the filters criteria', async () => {
  //     const [jobPosting1, jobPosting2] = jobPostings;
  //     await ApplicationRepository.createApplication({
  //       jobPostingId: jobPosting1?.id,
  //       userId: userIdA,
  //     });

  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         companyName: mockCompanyName,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(1);
  //     assert(jobs[0]);
  //     expect(jobs[0]._id.toString()).to.equal(jobPosting2?.id);
  //   });

  //   it('should return job postings matching the date filters', async () => {
  //     const jobPosting3 = jobPostings[2];
  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         postingDateRangeStart: mockStartDate,
  //         postingDateRangeEnd: mockEndDate,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(1);
  //     expect(jobs[0]?._id.toString()).to.equal(jobPosting3?.id);
  //   });

  //   it('should return an empty array when filters by field with no matching postings', async () => {
  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         jobTitle: 'PD',
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(0);
  //   });

  //   it('should not exclude job postings applied by another user', async () => {
  //     const [jobPosting1, jobPosting2] = jobPostings;
  //     await ApplicationRepository.createApplication({
  //       jobPostingId: jobPosting2?.id,
  //       userId: userIdA,
  //     });
  //     await ApplicationRepository.createApplication({
  //       jobPostingId: jobPosting1?.id,
  //       userId: userIdB,
  //     });

  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         companyName: mockCompanyName,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(1);
  //     expect(jobs[0]?._id.toString()).to.equal(jobPosting1?.id);
  //   });

  //   it('should return job postings matching jobTitle, companyName, and location', async () => {
  //     const [, jobPosting2] = jobPostings;
  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         companyName: mockCompanyName,
  //         jobTitle: mockJobTitle,
  //         location: JobPostingRegion.CANADA,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(1);
  //     expect(jobs[0]?._id.toString()).to.equal(jobPosting2?.id);
  //   });

  //   it('should return job posting if user deleted the application', async () => {
  //     const [, jobPosting2] = jobPostings;
  //     const applications = await Promise.all(
  //       jobPostings.map((jobPosting) =>
  //         ApplicationRepository.createApplication({
  //           jobPostingId: jobPosting?.id,
  //           userId: userIdA,
  //         })
  //       )
  //     );

  //     await ApplicationRepository.deleteApplicationById({
  //       applicationId: applications[1]?.id,
  //       userId: userIdA,
  //     });

  //     const jobs = await JobPostingService.getJobPostingsUserHasNotAppliedTo({
  //       userId: userIdA,
  //       filters: {
  //         companyName: mockCompanyName,
  //         jobTitle: mockJobTitle,
  //       },
  //     });

  //     expect(jobs).to.be.an('array').that.has.lengthOf(1);
  //     expect(jobs[0]?._id.toString()).to.equal(jobPosting2?.id);
  //   });
  // });
});
