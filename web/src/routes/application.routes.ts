import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/',
  authenticate,
  ApplicationController.createApplication
);
ApplicationRoutes.get('/', ApplicationController.getAllApplications);
ApplicationRoutes.get('/:id', ApplicationController.getOneApplication);

export default ApplicationRoutes;
