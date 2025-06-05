import { Router } from 'express';
import { JobPostingController } from '@/controllers/job-posting.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { authenticate } from '@/middlewares/auth.middleware';

export const JobPostingRoutes = Router();
JobPostingRoutes.use(wrappedHandlers([authenticate]));
JobPostingRoutes.put(
  '/:jobPostingId',
  wrappedHandlers([JobPostingController.updateJobPosting])
);
JobPostingRoutes.delete(
  '/:jobPostingId',
  wrappedHandlers([JobPostingController.deleteJobPosting])
);
JobPostingRoutes.get(
  '/not-applied',
  wrappedHandlers([JobPostingController.getJobPostingsUserHasNotAppliedTo])
);
