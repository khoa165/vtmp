import { Router } from 'express';
import { LinkController } from '@/controllers/link.controller';
import { wrappedHandlers } from '@/middlewares/utils';

export const LinkRoutes = Router();

LinkRoutes.post('/', wrappedHandlers([LinkController.submitLink]));
LinkRoutes.get('/', wrappedHandlers([LinkController.getPendingLinks]));
LinkRoutes.post(
  '/:linkId/approve',
  wrappedHandlers([LinkController.approveLink])
);
LinkRoutes.post(
  '/:linkId/reject',
  wrappedHandlers([LinkController.rejectLink])
);
