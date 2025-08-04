import { Router } from 'express';

import { Permission } from '@vtmp/common/constants';

import { JobPostingController } from '@/controllers/job-posting.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const JobPostingRoutes = Router();

JobPostingRoutes.use(wrappedHandlers([authenticate]));

JobPostingRoutes.get(
  '/not-applied',
  wrappedHandlers([
    hasPermission(Permission.VIEW_JOB_POSTING),
    JobPostingController.getJobPostingsUserHasNotAppliedTo,
  ])
);

JobPostingRoutes.get(
  '/not-applied-count',
  wrappedHandlers([
    hasPermission(Permission.VIEW_JOB_POSTING),
    JobPostingController.getJobPostingsUserHasNotAppliedToCount,
  ])
);

JobPostingRoutes.get(
  '/:jobPostingId',
  wrappedHandlers([
    hasPermission(Permission.VIEW_JOB_POSTING),
    JobPostingController.getJobPostingById,
  ])
);

JobPostingRoutes.put(
  '/:jobPostingId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_JOB_POSTING),
    JobPostingController.updateJobPosting,
  ])
);
JobPostingRoutes.delete(
  '/:jobPostingId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_JOB_POSTING),
    JobPostingController.deleteJobPosting,
  ])
);
