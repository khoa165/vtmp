import { expect } from 'chai';
import assert from 'assert';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewObjectId } from '@/testutils/mongoID.testutil';
import { differenceInSeconds } from 'date-fns';
import { ApplicationRepository } from '@/repositories/application.repository';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { IJobPosting } from '@/models/job-posting.model';

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
    it('should be able to find a job post by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      assert(foundJobPosting);
      expect(foundJobPosting).to.deep.include(mockJobPosting);
    });

    it('should return null if trying to get soft-deleted job posting', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      await JobPostingRepository.deleteJobPostingById(newJobPosting.id);
      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      assert(!foundJobPosting);
    });
  });

  describe('updateJobPostingById', () => {
    it('should be able to update detail of a job post by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      expect(updatedJobPosting).to.deep.include(newUpdate);
    });

    it('should return null if trying to update soft-deleted job posting', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      await JobPostingRepository.deleteJobPostingById(newJobPosting.id);

      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };
      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      assert(!updatedJobPosting);
    });
  });

  describe('deleteJobPostingById', () => {
    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
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
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
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
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(userIdA);

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an exact array of job postings that matches all available job postings in the system if user has no applied to any posting ', async () => {
      const jobsNotAppliedByUserA =
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(userIdA);

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
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(userIdA);

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
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(userIdA);

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
        await JobPostingRepository.getJobPostingsUserHasNotAppliedTo(userIdA);

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(2);
      expect(
        jobsNotAppliedByUserA.map((job) => job._id?.toString())
      ).to.have.members([jobPosting3?.id, jobPosting4?.id]);
    });
  });

  describe(' getJobPostingsInADay', () => {
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
        datePosted: new Date(Date.now() - 24 * 60 * 20 * 1000),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example2.com/job-posting',
        jobTitle: 'Software Engineer 2',
        companyName: 'Example Company 2',
        submittedBy: getNewObjectId(),
        datePosted: new Date(Date.now() - 24 * 20 * 20 * 1000),
      },
      {
        linkId: getNewObjectId(),
        url: 'http://example3.com/job-posting',
        jobTitle: 'Software Engineer 3',
        companyName: 'Example Company 3',
        submittedBy: getNewObjectId(),
        datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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

    it('should return an array of job posting in a day', async () => {
      const [jobPosting1, jobPosting2] = jobPostings;
      const jobsInAday =
        await JobPostingRepository.getJobPostingsInADay(userIdA);

      expect(jobsInAday).to.be.an('array').that.have.lengthOf(2);
      expect(jobsInAday.map((jobs) => jobs._id?.toString())).to.have.members([
        jobPosting1?.id,
        jobPosting2?.id,
      ]);
    });

    it('should return an empty array if user has applied to all avaialble job postings in a day', async () => {
      await Promise.all(
        jobPostings.map((jobPosting) =>
          ApplicationRepository.createApplication({
            jobPostingId: jobPosting?.id,
            userId: userIdA,
          })
        )
      );

      const jobsInADay =
        await JobPostingRepository.getJobPostingsInADay(userIdA);

      expect(jobsInADay).to.be.an('array').that.have.lengthOf(0);
    });

    it('should not exclude a job posting from the returned array if the user deleted the job posting', async () => {
      const [jobPosting1, jobPosting2] = jobPostings;
      await JobPostingRepository.deleteJobPostingById(jobPosting1?.id);

      const jobsInADay =
        await JobPostingRepository.getJobPostingsInADay(userIdA);

      expect(jobsInADay).to.be.an('array').that.have.lengthOf(1);
      assert(jobsInADay[0]);
      expect(jobsInADay[0]._id.toString()).to.equal(jobPosting2?.id);
    });

    it('should return all job postings in a day that user has not applied to. Should not exclude job postings applied by another user', async () => {
      const [jobPosting1, jobPosting2] = jobPostings;
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting1?.id,
        userId: userIdB,
      });
      await ApplicationRepository.createApplication({
        jobPostingId: jobPosting2?.id,
        userId: userIdB,
      });

      const jobsInAday =
        await JobPostingRepository.getJobPostingsInADay(userIdA);

      expect(jobsInAday).to.be.an('array').that.have.lengthOf(2);
      expect(jobsInAday.map((jobs) => jobs._id?.toString())).to.have.members([
        jobPosting1?.id,
        jobPosting2?.id,
      ]);
    });

    it('should not exclude a job posting in a day from the returned array, if the user applied to that job posting, but later deleted the application associated with it', async () => {
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
        await JobPostingRepository.getJobPostingsInADay(userIdA);

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
      assert(jobsNotAppliedByUserA[0]);
      expect(jobsNotAppliedByUserA[0]._id?.toString()).to.equal(
        jobPostings[0]?.id
      );
    });
  });
});
