import { Router } from 'express';

import { InvitationController } from '@/controllers/invitation.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authorization.middleware';
import { wrappedHandlers } from '@/middlewares/utils';
import { Permission } from '@vtmp/common/constants';

export const InvitationRoutes = Router();
InvitationRoutes.use(wrappedHandlers([authenticate]));

InvitationRoutes.get(
  '/',
  wrappedHandlers([
    hasPermission(Permission.VIEW_INVITATION),
    InvitationController.getAllInvitations,
  ])
);

InvitationRoutes.post(
  '/',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_INVITATION),
    InvitationController.sendInvitation,
  ])
);

InvitationRoutes.put(
  '/:invitationId/revoke',
  wrappedHandlers([
    hasPermission(Permission.MANAGE_INVITATION),
    InvitationController.revokeInvitation,
  ])
);
