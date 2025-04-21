import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import assert from 'assert';
import { JobPostingRepository } from '@/repositories/job-posting.repository';
import { useMongoDB } from '@/testutils/mongoDB.testutil';
import { getNewObjectId } from '@/testutils/mongoID.testutil';
import { differenceInSeconds } from 'date-fns';
import { ApplicationRepository } from '@/repositories/application.repository';
import { getNewMongoId } from '@/testutils/mongoID.testutil';
import { IJobPosting } from '@/models/job-posting.model';

chai.use(chaiSubset);
const { expect } = chai;

describe('JobPostingRepository', () => {
  useMongoDB();

  const mockJobPosting = {
    linkId: getNewObjectId(),
    url: 'http://example.com/job-posting',
    jobTitle: 'Software Engineer',
    companyName: 'Example Company',
    submittedBy: getNewObjectId(),
  };

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

  describe('createJobPosting', () => {
    it('should be able to create a new job posting', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);

      expect(newJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('getJobPostingById', () => {
    it('should be able to find a job post by id', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);
      const foundJobPosting = await JobPostingRepository.getJobPostingById(
        newJobPosting.id
      );

      assert(foundJobPosting);
      expect(foundJobPosting).to.containSubset(mockJobPosting);
    });
  });

  describe('updateJobPostingById', () => {
    it('should be able to update detail of a job post by id', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);

      const newUpdate = {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Updated Company',
        jobDescription: 'This is an updated job description.',
      };

      const updatedJobPosting = await JobPostingRepository.updateJobPostingById(
        newJobPosting.id,
        newUpdate
      );

      expect(updatedJobPosting).to.containSubset(newUpdate);
    });
  });

  describe('deleteJobPostingById', () => {
    it('should be able to set a delete-timestamp for a job posting by id', async () => {
      const newJobPosting =
        await JobPostingRepository.createJobPosting(mockJobPosting);
      const deletedJobPosting = await JobPostingRepository.deleteJobPostingById(
        newJobPosting.id
      );

      assert(deletedJobPosting);
      assert('deletedAt' in deletedJobPosting);

      const timeDiff = differenceInSeconds(
        new Date(),
        deletedJobPosting.deletedAt
      );

      expect(timeDiff).to.lessThan(3);
    });

    describe('getJobPostingsNotApplied', () => {
      const userIdA = getNewMongoId();
      const userIdB = getNewMongoId();
      let jobPostings: IJobPosting[];

      beforeEach(async () => {
        jobPostings = await Promise.all(
          mockMultipleJobPostings.map((jobPosting) =>
            JobPostingRepository.createJobPosting(jobPosting)
          )
        );
      });

      it('should return an empty array if user has applied to all avaialble job postings in the system', async () => {
        await Promise.all(
          jobPostings.map((jobPosting) =>
            ApplicationRepository.createApplication({
              jobPostingId: jobPosting.id,
              userId: userIdA,
            })
          )
        );
        const jobsNotAppliedByUserA =
          await JobPostingRepository.getJobPostingsNotApplied(userIdA);

        expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(0);
      });

      it('should return an exact array of job postings that matches all available job postings in the system if user has no applied to any posting ', async () => {
        const jobsNotAppliedByUserA =
          await JobPostingRepository.getJobPostingsNotApplied(userIdA);

        expect(jobsNotAppliedByUserA).to.be.an('array').that.has.length(4);
        expect(
          jobsNotAppliedByUserA.map((jobPosting) => jobPosting._id?.toString())
        ).to.have.members(jobPostings.map((jobPosting) => jobPosting.id));
      });

      it('should exclude soft-deleted job postings from the returned array', async () => {
        const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] =
          jobPostings;
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
          await JobPostingRepository.getJobPostingsNotApplied(userIdA);

        expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(1);
        expect(
          jobsNotAppliedByUserA.map((jobPosting) => jobPosting._id?.toString())
        ).to.have.members([jobPosting4?.id]);
      });

      it('should return all job postings that user has not applied to. Should not exclude job postings applied by another user', async () => {
        const [jobPosting1, jobPosting2, jobPosting3, jobPosting4] =
          jobPostings;
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
          await JobPostingRepository.getJobPostingsNotApplied(userIdA);

        expect(jobsNotAppliedByUserA).to.be.an('array').that.have.lengthOf(2);
        expect(
          jobsNotAppliedByUserA.map((jobPosting) => jobPosting._id?.toString())
        ).to.have.members([jobPosting3?.id, jobPosting4?.id]);
      });
    });
  });
});
