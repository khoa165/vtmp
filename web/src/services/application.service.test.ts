import { expect } from 'chai';

import ApplicationService from './application.service';
import Application from '@/models/application.model';
import JobPosting from '@/models/jobPosting.model';
import { useMongoDB } from '@/config/mongodb.testutils';
import mongoose from 'mongoose';

describe('ApplicationService', () => {
  useMongoDB();

  describe('createApplication', () => {
    it('should throw error if job posting does not exist', async () => {
      const mockApplication = {
        jobPostingId: new mongoose.Types.ObjectId().toString(),
        userId: new mongoose.Types.ObjectId().toString(),
      };

      try {
        await ApplicationService.createApplication(mockApplication);
      } catch (error) {
        expect((error as Error).message).to.equal('Job posting does not exist');
      }
    });

    it('should throw error if an application associated with this job posting and user already exist', async () => {
      // Create mock job posting
      const mockJobPosting = {
        linkId: new mongoose.Types.ObjectId().toString(),
        url: 'vtmp.com',
        jobTitle: 'SWE',
        companyName: 'Apple',
        submittedBy: new mongoose.Types.ObjectId().toString(),
      };

      // Save the mock job posting to JobPosting collection
      const newJobPosting = await JobPosting.create(mockJobPosting);

      // Create mock application associated with the above job posting
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: new mongoose.Types.ObjectId().toString(),
      };

      await Application.create(mockApplication);

      try {
        await ApplicationService.createApplication(mockApplication);
      } catch (error) {
        expect((error as Error).message).to.equal(
          'Application associated with this job posting and user already exists'
        );
      }
    });

    it('should create an application successfully', async () => {
      // Create mock job posting
      const mockJobPosting = {
        linkId: new mongoose.Types.ObjectId().toString(),
        url: 'vtmp.com',
        jobTitle: 'SWE',
        companyName: 'Apple',
        submittedBy: new mongoose.Types.ObjectId().toString(),
      };

      // Save the job posting to JobPosting collection
      const newJobPosting = await JobPosting.create(mockJobPosting);

      // Create mock application associated with the above job posting
      const mockApplication = {
        jobPostingId: newJobPosting.id,
        userId: new mongoose.Types.ObjectId().toString(),
      };

      try {
        const newApplication = await ApplicationService.createApplication(
          mockApplication
        );
        const application = await Application.findById(newApplication.id);

        expect(application?.jobPostingId.toString()).to.equal(
          mockApplication.jobPostingId
        );
        expect(application?.userId.toString()).to.equal(mockApplication.userId);
      } catch (error) {
        expect.fail(`Expect no error: but got: ${(error as Error).message}`);
      }
    });
  });
});
