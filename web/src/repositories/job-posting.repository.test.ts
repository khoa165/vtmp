import { expect } from 'chai';
import assert from 'assert';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewObjectId } from '@/testutils/mongoID.testutil';
import { differenceInSeconds } from 'date-fns';
import { ApplicationRepository } from '@/repositories/application.repository';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { IJobPosting } from '@/models/job-posting.model';
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

    const mockMultipleJobPostings = [
      {
        linkId: getNewObjectId(),
        url: 'http://example1.com/job-posting',
        jobTitle: 'Software Engineer 1',
        companyName: 'Example Company 1',
        submittedBy: getNewObjectId(),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example2.com/job-posting',
        jobTitle: 'Software Engineer 2',
        companyName: 'Example Company 2',
        submittedBy: getNewObjectId(),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example3.com/job-posting',
        jobTitle: 'Software Engineer 3',
        companyName: 'Example Company 3',
        submittedBy: getNewObjectId(),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example4.com/job-posting',
        jobTitle: 'Software Engineer 4',
        companyName: 'Example Company 4',
        submittedBy: getNewObjectId(),
      },
    ];

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
        });

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an exact array of job postings that matches all available job postings in the system if user has no applied to any posting ', async () => {
      const jobsNotAppliedByUserA =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
        });

      expect(jobsNotAppliedByUserA)
        .to.be.an('array')
        .that.has.length(mockMultipleJobPostings.length);
      expect(
        jobsNotAppliedByUserA.map((job) => job._id?.toString())
      ).to.have.members(jobPostings.map((jobPosting) => jobPosting?.id));
    });

    it('should exclude soft-deleted job postings from the returned array', async () => {
      const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdA,
      });
      await JobPostingRepository.deleteJobPostingById(jobPosting3?.id);

      const jobsNotAppliedByUserA =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
        });

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
      assert(jobsNotAppliedByUserA[0]);
      expect(jobsNotAppliedByUserA[0]._id?.toString()).to.equal(
        jobPosting4?.id
      );
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
        });

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
      assert(jobsNotAppliedByUserA[0]);
      expect(jobsNotAppliedByUserA[0]._id?.toString()).to.equal(
        jobPostings[0]?.id
      );
    });

    it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
      const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting3?.id,
        userId: userIdB,
      });
      const jobsNotAppliedByUserA =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
        });

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(2);
      expect(
        jobsNotAppliedByUserA.map((job) => job._id?.toString())
      ).to.have.members([jobPosting3?.id, jobPosting4?.id]);
    });
  });

  describe('getJobPostingsUserHasNotAppliedTo with Filter', () => {
    const userIdA = getNewMongoId();
    const userIdB = getNewMongoId();
    const mockCompanyName = 'Company 1';
    const mockJobTitle = 'Engineer 2';
    const mockStartDate = new Date('2023-12-31');
    const mockEnDDate = new Date('2024-05-01');
    let jobPostings: (IJobPosting | undefined)[];

    const mockMultipleJobPostings = [
      {
        linkId: getNewObjectId(),
        url: 'http://example1.com/job-posting',
        jobTitle: 'Software Engineer 1',
        companyName: 'Example Company 1',
        submittedBy: getNewObjectId(),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example2.com/job-posting',
        jobTitle: 'Software Engineer 2',
        companyName: 'Example Company 1',
        submittedBy: getNewObjectId(),
        location: JobPostingRegion.CANADA,
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example3.com/job-posting',
        jobTitle: 'Software Engineer 3',
        companyName: 'Example Company 3',
        submittedBy: getNewObjectId(),
        datePosted: new Date('2024-01-01'),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example4.com/job-posting',
        jobTitle: 'Software Engineer 4',
        companyName: 'Example Company 4',
        submittedBy: getNewObjectId(),
        datePosted: new Date('2023-7-31'),
      },
    ];

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
          filters: { companyName: mockCompanyName },
        });

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return only the job postings not applied by the user and matching the company name filters', async () => {
      const [jobPosting1, jobPosting2] = jobPostings;
      const jobsNotAppliedByUserAWithFilterLocation =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
        });

      expect(jobsNotAppliedByUserAWithFilterLocation)
        .to.be.an('array')
        .that.have.lengthOf(2);
      jobsNotAppliedByUserAWithFilterLocation.forEach((job) => {
        assert(job);
      });
      expect(
        jobsNotAppliedByUserAWithFilterLocation.map((job) =>
          job._id?.toString()
        )
      ).to.have.members([jobPosting1?.id, jobPosting2?.id]);
    });

    it('should returns job postings not applied by user after applying to one, matching the filters criteria', async () => {
      const [jobPosting1, jobPosting2] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdA,
      });

      const jobsNotAppliedByUserAWithFilterLocation =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
        });

      expect(jobsNotAppliedByUserAWithFilterLocation)
        .to.be.an('array')
        .that.have.lengthOf(1);
      assert(jobsNotAppliedByUserAWithFilterLocation[0]);
      expect(
        jobsNotAppliedByUserAWithFilterLocation[0]._id.toString()
      ).to.equal(jobPosting2?.id);
    });

    it('should returns job postings not applied by user after applying to one, matching the filters with date', async () => {
      const jobPosting3 = jobPostings[2];
      const jobs = await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(
        {
          userId: userIdA,
          filters: {
            postingDateRangeStart: mockStartDate,
            postingDateRangeEnd: mockEnDDate,
          },
        }
      );

      expect(jobs).to.be.an('array').that.have.lengthOf(1);
      assert(jobs[0]);
      expect(jobs[0]?._id.toString()).to.equal(jobPosting3?.id);
    });

    it('should return empty array when filters by field with no matching postings', async () => {
      const mockTitle = 'PD';
      const jobsNotAppliedByUserAWithFilterLocation =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: { jobTitle: mockTitle },
        });

      expect(jobsNotAppliedByUserAWithFilterLocation)
        .to.be.an('array')
        .that.have.lengthOf(0);
    });

    it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
      const [jobPosting1, jobPosting2] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdA,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdB,
      });

      const jobsNotAppliedByUserAWithFilterLocation =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: { companyName: mockCompanyName },
        });

      expect(jobsNotAppliedByUserAWithFilterLocation)
        .to.be.an('array')
        .that.have.lengthOf(1);
      assert(jobsNotAppliedByUserAWithFilterLocation[0]);
      expect(
        jobsNotAppliedByUserAWithFilterLocation[0]?._id.toString()
      ).to.equal(jobPosting1?.id);
    });

    it('should return all job postings that user has not applied to  when filters by Job Tile, Company Name and Location ', async () => {
      const [, jobPosting2] = jobPostings;

      const jobsNotAppliedByUserAWithFilterLocation =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo({
          userId: userIdA,
          filters: {
            companyName: mockCompanyName,
            jobTitle: mockJobTitle,
            location: JobPostingRegion.CANADA,
          },
        });

      expect(jobsNotAppliedByUserAWithFilterLocation)
        .to.be.an('array')
        .that.have.lengthOf(1);
      assert(jobsNotAppliedByUserAWithFilterLocation[0]);
      expect(
        jobsNotAppliedByUserAWithFilterLocation[0]?._id.toString()
      ).to.equal(jobPosting2?.id);
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

      const jobs = await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(
        {
          userId: userIdA,
          filters: {
            companyName: mockCompanyName,
            jobTitle: mockJobTitle,
          },
        }
      );

      expect(jobs).to.be.an('array').with.lengthOf(1);
      assert(jobs[0]);
      expect(jobs[0]?._id.toString()).to.equal(jobPosting2?.id);
    });

    it('should returns job postings not applied by user after applying to one, matching the filters with Job Function and Type', async () => {
      const jobs = await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(
        {
          userId: userIdA,
          filters: {
            jobFunction: JobFunction.SOFTWARE_ENGINEER,
            jobType: JobType.INTERNSHIP,
          },
        }
      );

      expect(jobs).to.be.an('array').with.lengthOf(4);
    });
  });
});
