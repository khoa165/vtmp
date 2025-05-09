import { Router } from 'express';
import { InvitationController } from '@/controllers/invitation.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { authenticate } from '@/middlewares/auth.middleware';

export const InvitationRoutes = Router();

InvitationRoutes.use(wrappedHandlers([authenticate]));

InvitationRoutes.get(
  '/',
  wrappedHandlers([InvitationController.getAllInvitations])
);

InvitationRoutes.post(
  '/',
  wrappedHandlers([InvitationController.sendInvitation])
);

InvitationRoutes.put(
  '/:invitationId/revoke',
  wrappedHandlers([InvitationController.revokeInvitation])
);

InvitationRoutes.post(
  '/validate',
  wrappedHandlers([InvitationController.validateInvitation])
);
