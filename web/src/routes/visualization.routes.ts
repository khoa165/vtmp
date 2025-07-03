import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';
import { VisualizationController } from '@/controllers/visualization.controller';

export const VisualizationRoutes = Router();

VisualizationRoutes.use(wrappedHandlers([authenticate]));

VisualizationRoutes.get(
  '/',
  wrappedHandlers([
    hasPermission(Permission.VIEW_VISUALIZATION),
    VisualizationController.getVisualizationStats,
  ])
);
