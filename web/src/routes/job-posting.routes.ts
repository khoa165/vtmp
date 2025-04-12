import { Router } from 'express';
import { JobPostingController } from '@/controllers/job-posting.controller';
import { wrappedHandlers } from '@/middlewares/utils';
const JobPostingRoutes = Router();

JobPostingRoutes.put(
  '/:jobId',
  wrappedHandlers([JobPostingController.updateJobPosting])
);
JobPostingRoutes.delete(
  '/:jobId',
  wrappedHandlers([JobPostingController.deleteJobPosting])
);

export default JobPostingRoutes;
