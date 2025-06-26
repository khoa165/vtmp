import { Router } from 'express';
import { LinkController } from '@/controllers/link.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';
import { Permission } from '@vtmp/common/constants';
import { hasPermission } from '@/middlewares/authorization.middleware';

export const LinkRoutes = Router();
LinkRoutes.use(wrappedHandlers([authenticate]));
LinkRoutes.post(
  '/',
  wrappedHandlers([
    hasPermission(Permission.CREATE_JOB_LINK),
    LinkController.submitLink,
  ])
);
LinkRoutes.get(
  '/',
  wrappedHandlers([
    hasPermission(Permission.VIEW_JOB_LINK),
    LinkController.getLinks,
  ])
);
LinkRoutes.get(
  '/count-by-status',
  wrappedHandlers([
    hasPermission(Permission.VIEW_JOB_LINK),
    LinkController.getLinkCountByStatus,
  ])
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
LinkRoutes.put(
  '/:linkId/metaData',
  wrappedHandlers([LinkController.updateLinkMetaData])
);
