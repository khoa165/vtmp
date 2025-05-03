import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
// import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const ApplicationRoutes = Router();

// ApplicationRoutes.use(wrappedHandlers([authenticate]));
ApplicationRoutes.post(
  '/',
  wrappedHandlers([ApplicationController.createApplication])
);
ApplicationRoutes.get(
  '/',
  wrappedHandlers([ApplicationController.getApplications])
);
ApplicationRoutes.get(
  '/countByStatus',
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
