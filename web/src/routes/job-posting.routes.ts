import { Router } from 'express';
import { JobPostingController } from '@/controllers/job-posting.controller';
import { wrappedHandlers } from '@/middlewares/utils';
// import { authenticate } from '@/middlewares/auth.middleware';

export const JobPostingRoutes = Router();

JobPostingRoutes.put(
  '/:jobId',
  wrappedHandlers([JobPostingController.updateJobPosting])
);
JobPostingRoutes.delete(
  '/:jobId',
  wrappedHandlers([JobPostingController.deleteJobPosting])
);
JobPostingRoutes.get(
  '/not-applied',
  // authenticate,
  wrappedHandlers([JobPostingController.getJobPostingsUserHasNotAppliedTo])
);

// JobPostingRoutes.post(
//   '/not-applied/filter',
//   // authenticate,
//   wrappedHandlers([
//     JobPostingController.getJobPostingsUserHasNotAppliedToWithFilter,
//   ])
// );
