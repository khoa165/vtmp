import { Router } from 'express';

import { CronController } from '@/controllers/cron.controller';

export const CronRoutes = Router();
CronRoutes.post('/run-immediately', wrappedHandlers([CronController.runImmediateLy]));
