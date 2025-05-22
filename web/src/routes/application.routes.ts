import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';

export const ApplicationRoutes = Router();

ApplicationRoutes.use(
  wrappedHandlers([authenticate, hasPermission(Permission.MANAGE_APPLICATION)])
);

ApplicationRoutes.post(
  '/',
  wrappedHandlers([ApplicationController.createApplication])
);
ApplicationRoutes.get(
  '/',
  wrappedHandlers([ApplicationController.getApplications])
);
ApplicationRoutes.get(
  '/count-by-status',
  wrappedHandlers([ApplicationController.getApplicationsCountByStatus])
);
ApplicationRoutes.get(
  '/:applicationId',
  wrappedHandlers([ApplicationController.getApplicationById])
);
ApplicationRoutes.put(
  '/:applicationId/updateStatus',
  wrappedHandlers([ApplicationController.updateApplicationStatus])
);
ApplicationRoutes.put(
  '/:applicationId',
  wrappedHandlers([ApplicationController.updateApplicationMetadata])
);
ApplicationRoutes.delete(
  '/:applicationId',
  wrappedHandlers([ApplicationController.deleteApplication])
);
