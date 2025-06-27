import { Router } from 'express';

import { Permission } from '@vtmp/common/constants';

import { CronController } from '@/controllers/cron.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const CronRoutes = Router();
CronRoutes.use(wrappedHandlers([authenticate]));
CronRoutes.post(
  '/run-immediately',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_JOB_LINK),
    CronController.runImmediateLy,
  ])
);
