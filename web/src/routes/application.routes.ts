import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/',
  wrappedHandlers([authenticate, ApplicationController.createApplication])
);
ApplicationRoutes.get('/', authenticate, ApplicationController.getApplications);
ApplicationRoutes.get(
  '/:applicationId',
  authenticate,
  ApplicationController.getApplicationById
);
