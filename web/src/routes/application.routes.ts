import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/',
  wrappedHandlers([authenticate, ApplicationController.createApplication])
);
ApplicationRoutes.get(
  '/',
  wrappedHandlers([authenticate, ApplicationController.getApplications])
);
ApplicationRoutes.get(
  '/:applicationId',
  wrappedHandlers([authenticate, ApplicationController.getApplicationById])
);
ApplicationRoutes.put(
  '/:applicationId',
  wrappedHandlers([authenticate, ApplicationController.updateApplicationStatus])
);
ApplicationRoutes.put(
  '/:applicationId',
  wrappedHandlers([
    authenticate,
    ApplicationController.updateApplicationMetadata,
  ])
);
ApplicationRoutes.delete(
  '/:applicationId',
  wrappedHandlers([authenticate, ApplicationController.deleteApplication])
);
