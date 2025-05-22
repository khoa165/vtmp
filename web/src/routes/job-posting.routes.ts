import { Router } from 'express';
import { JobPostingController } from '@/controllers/job-posting.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';

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
  wrappedHandlers([
    authenticate,
    hasPermission(Permission.MANAGE_APPLICATION),
    JobPostingController.getJobPostingsUserHasNotAppliedTo,
  ])
);
