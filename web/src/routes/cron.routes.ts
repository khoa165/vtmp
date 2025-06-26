import { Router } from 'express';

import { CronController } from '@/controllers/cron.controller';
import { wrappedHandlers } from '@/middlewares/utils';

export const CronRoutes = Router();
CronRoutes.post(
  '/run-immediately',
  wrappedHandlers([CronController.runImmediateLy])
);
