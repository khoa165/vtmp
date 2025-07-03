import { Router } from 'express';

import { Permission } from '@vtmp/common/constants';

import { VisualizationController } from '@/controllers/visualization.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const VisualizationRoutes = Router();

VisualizationRoutes.use(wrappedHandlers([authenticate]));

VisualizationRoutes.get(
  '/',
  wrappedHandlers([
    hasPermission(Permission.VIEW_VISUALIZATION),
    VisualizationController.getVisualizationStats,
  ])
);
