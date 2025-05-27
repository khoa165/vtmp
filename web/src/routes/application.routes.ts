import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';
import { authenticate } from '@/middlewares/auth.middleware';

export const ApplicationRoutes = Router();

ApplicationRoutes.use(wrappedHandlers([authenticate]));

ApplicationRoutes.get(
  '/',
  wrappedHandlers([
    hasPermission(Permission.VIEW_APPLICATION),
    ApplicationController.getApplications,
  ])
);
ApplicationRoutes.get(
  '/count-by-status',
  wrappedHandlers([
    hasPermission(Permission.VIEW_APPLICATION),
    ApplicationController.getApplicationsCountByStatus,
  ])
);
ApplicationRoutes.get(
  '/:applicationId',
  wrappedHandlers([
    hasPermission(Permission.VIEW_APPLICATION),
    ApplicationController.getApplicationById,
  ])
);
ApplicationRoutes.post(
  '/',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_APPLICATION),
    ApplicationController.createApplication,
  ])
);
ApplicationRoutes.put(
  '/:applicationId/updateStatus',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_APPLICATION),
    ApplicationController.updateApplicationStatus,
  ])
);
ApplicationRoutes.put(
  '/:applicationId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_APPLICATION),
    ApplicationController.updateApplicationMetadata,
  ])
);
ApplicationRoutes.delete(
  '/:applicationId',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_APPLICATION),
    ApplicationController.deleteApplication,
  ])
);
