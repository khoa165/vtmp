import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/',
  authenticate,
  ApplicationController.createApplication
);
ApplicationRoutes.get('/', authenticate, ApplicationController.getApplications);
ApplicationRoutes.get(
  '/:applicationId',
  authenticate,
  ApplicationController.getApplicationById
);

export default ApplicationRoutes;
