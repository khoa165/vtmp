import { Router } from 'express';
import ApplicationController from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/create',
  authenticate,
  ApplicationController.createApplication
);

// Route to get all applications for the authenticated user
ApplicationRoutes.get('/', ApplicationController.getAllApplications);

// Route to get a specific application by ID
ApplicationRoutes.get('/:id', ApplicationController.getOneApplication);

export default ApplicationRoutes;
