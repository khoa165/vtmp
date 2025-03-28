import { Router } from 'express';
import JobPostingController from '@/controllers/jobPosting.controller';
const JobPostingRoutes = Router();

JobPostingRoutes.put(
  '/job-postings/:jobId',
  JobPostingController.updateJobPosting
);
JobPostingRoutes.delete(
  '/job-postings/:jobId',
  JobPostingController.deleteJobPosting
);

export default JobPostingRoutes;
