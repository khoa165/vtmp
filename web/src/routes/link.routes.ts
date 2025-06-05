import { Router } from 'express';
import { LinkController } from '@/controllers/link.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { Permission } from '@vtmp/common/constants';

export const LinkRoutes = Router();

LinkRoutes.use(wrappedHandlers([authenticate]));
LinkRoutes.post('/', wrappedHandlers([LinkController.submitLink]));
LinkRoutes.get('/', wrappedHandlers([LinkController.getLinks]));
LinkRoutes.get(
  '/count-by-status',
  wrappedHandlers([LinkController.getLinkCountByStatus])
);
LinkRoutes.post(
  '/:linkId/approve',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_JOB_LINK),
    LinkController.approveLink,
  ])
);
LinkRoutes.post(
  '/:linkId/reject',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_JOB_LINK),
    LinkController.rejectLink,
  ])
);
