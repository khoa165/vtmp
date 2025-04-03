import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/',
  authenticate,
  ApplicationController.createApplication
);
ApplicationRoutes.get(
  '/',
  authenticate,
  ApplicationController.getAllApplications
);
ApplicationRoutes.get(
  '/:applicationId',
  authenticate,
  ApplicationController.getOneApplication
);

export default ApplicationRoutes;
