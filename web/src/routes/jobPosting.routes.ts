import { Router } from 'express';
import JobPostingController from '@/controllers/jobPosting.controller';
const JobPostingRoutes = Router();

JobPostingRoutes.put(
  '/job-postings/:id',
  JobPostingController.updateJobPosting
);
JobPostingRoutes.delete(
  '/job-postings/:id',
  JobPostingController.deleteJobPosting
);

export default JobPostingRoutes;
