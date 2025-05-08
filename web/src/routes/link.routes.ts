import { Router } from 'express';
import { LinkController } from '@/controllers/link.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const LinkRoutes = Router();

LinkRoutes.use(wrappedHandlers([authenticate]));
LinkRoutes.post('/', wrappedHandlers([LinkController.submitLink]));
LinkRoutes.get('/', wrappedHandlers([LinkController.getLinksByStatus]));
LinkRoutes.get(
  '/count-by-status',
  wrappedHandlers([LinkController.getLinkCountByStatus])
);
LinkRoutes.post(
  '/:linkId/approve',
  wrappedHandlers([LinkController.approveLink])
);
LinkRoutes.post(
  '/:linkId/reject',
  wrappedHandlers([LinkController.rejectLink])
);
