import { Router } from 'express';
import { LinkController } from '@/controllers/link.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';
import { Permission } from '@vtmp/common/constants';
import { hasPermission } from '@/middlewares/authorization.middleware';

export const LinkRoutes = Router();

LinkRoutes.post(
  '/',
  wrappedHandlers([
    authenticate,
    hasPermission(Permission.CREATE_JOB_LINK),
    LinkController.submitLink,
  ])
);
LinkRoutes.get(
  '/',
  wrappedHandlers([
    authenticate,
    hasPermission(Permission.VIEW_JOB_LINK),
    LinkController.getLinks,
  ])
);
LinkRoutes.get(
  '/count-by-status',
  wrappedHandlers([
    authenticate,
    hasPermission(Permission.VIEW_JOB_LINK),
    LinkController.getLinkCountByStatus,
  ])
);
LinkRoutes.post(
  '/:linkId/approve',
  wrappedHandlers([
    authenticate,
    hasPermission(Permission.MANAGE_JOB_LINK),
    LinkController.approveLink,
  ])
);
LinkRoutes.post(
  '/:linkId/reject',
  wrappedHandlers([
    authenticate,
    hasPermission(Permission.MANAGE_JOB_LINK),
    LinkController.rejectLink,
  ])
);
