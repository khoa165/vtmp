import { Router } from 'express';
import ApplicationController from '@/controllers/application.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const ApplicationRoutes = Router();

ApplicationRoutes.use(authenticate);
ApplicationRoutes.post('create', ApplicationController.createApplication);

export default ApplicationRoutes;
