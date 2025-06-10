import { Router } from 'express';
import { JobPostingController } from '@/controllers/job-posting.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';

export const JobPostingRoutes = Router();

JobPostingRoutes.use(wrappedHandlers([authenticate]));

JobPostingRoutes.get(
  '/id/:jobPostingId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_JOB_POSTING),
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
JobPostingRoutes.get(
  '/not-applied',
  wrappedHandlers([
    hasPermission(Permission.VIEW_JOB_POSTING),
    JobPostingController.getJobPostingsUserHasNotAppliedTo,
  ])
);
