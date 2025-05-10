import { expect } from 'chai';
import assert from 'assert';
import { JobPostingService } from '@/services/job-posting.service';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { ApplicationRepository } from '@/repositories/application.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewMongoId, getNewObjectId } from '@/testutils/mongoID.testutil';
import { ResourceNotFoundError } from '@/utils/errors';
import { differenceInSeconds } from 'date-fns';
import { IJobPosting } from '@/models/job-posting.model';

describe('JobPostingService', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

  describe('updateJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      await expect(
        JobPostingService.updateJobPostingById(getNewMongoId(), newUpdate)
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      await expect(
        JobPostingService.updateJobPostingById(newJobPosting.id, newUpdate)
      ).eventually.fulfilled;
    });

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
  });

  describe('deleteJobPostingById', () => {
    it('should throw an error when no job posting is found', async () => {
      await expect(
        JobPostingService.deleteJobPostingById(getNewMongoId())
      ).eventually.rejectedWith(ResourceNotFoundError);
    });

    it('should not throw an error when a job posting is found', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
      assert(newJobPosting);

      await expect(JobPostingService.deleteJobPostingById(newJobPosting.id))
        .eventually.fulfilled;
    });

    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting = await JobPostingRepository.createJobPosting({
        jobPostingData: mockJobPosting,
      });
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
        await JobPostingService.getJobPostingsUserHasNotAppliedTo(userIdA);

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
    });

    it('should return an exact array of job postings that matches all available job postings in the system if user has no applied to any posting', async () => {
      const jobsNotAppliedByUserA =
        await JobPostingService.getJobPostingsUserHasNotAppliedTo(userIdA);

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
        await JobPostingService.getJobPostingsUserHasNotAppliedTo(userIdA);

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
        await JobPostingService.getJobPostingsUserHasNotAppliedTo(userIdA);

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
        await JobPostingService.getJobPostingsUserHasNotAppliedTo(userIdA);

      expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(2);
      expect(
        jobsNotAppliedByUserA.map((job) => job._id?.toString())
      ).to.have.members([jobPosting3?.id, jobPosting4?.id]);
    });
  });
});
