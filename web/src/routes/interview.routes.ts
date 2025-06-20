import { InterviewController } from '@/controllers/interview.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';

export const InterviewRoutes = Router();

InterviewRoutes.use(wrappedHandlers([authenticate]));

InterviewRoutes.get(
  '/by-application/:applicationId',
  wrappedHandlers([
    hasPermission(Permission.VIEW_INTERVIEW),
    InterviewController.getInterviewsByApplicationId,
  ])
);
InterviewRoutes.get(
  '/shared',
  wrappedHandlers([
    hasPermission(Permission.VIEW_INTERVIEW),
    InterviewController.getSharedInterviews,
  ])
);
InterviewRoutes.get(
  '/',
  wrappedHandlers([
    hasPermission(Permission.VIEW_ALL_DATA),
    InterviewController.getInterviews,
  ])
);

InterviewRoutes.get(
  '/:interviewId',
  wrappedHandlers([
    hasPermission(Permission.VIEW_INTERVIEW),
    InterviewController.getInterviewById,
  ])
);

InterviewRoutes.post(
  '/',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_INTERVIEW),
    InterviewController.createInterview,
  ])
);

InterviewRoutes.put(
  '/:interviewId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_INTERVIEW),
    InterviewController.updateInterviewById,
  ])
);

InterviewRoutes.delete(
  '/:interviewId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_INTERVIEW),
    InterviewController.deleteInterviewById,
  ])
);

InterviewRoutes.post(
  '/share/:interviewId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_INTERVIEW),
    InterviewController.shareInterview,
  ])
);
