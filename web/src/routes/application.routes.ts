import { Router } from 'express';
import { ApplicationController } from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

const ApplicationRoutes = Router();

ApplicationRoutes.post(
  '/',
  wrappedHandlers([authenticate, ApplicationController.createApplication])
);

export default ApplicationRoutes;
