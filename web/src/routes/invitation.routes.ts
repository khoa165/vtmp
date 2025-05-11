import { Router } from 'express';
import { InvitationController } from '@/controllers/invitation.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { authenticate } from '@/middlewares/auth.middleware';

export const InvitationRoutes = Router();

InvitationRoutes.get(
  '/',
  wrappedHandlers([authenticate]),
  wrappedHandlers([InvitationController.getAllInvitations])
);

InvitationRoutes.post(
  '/',
  wrappedHandlers([authenticate]),
  wrappedHandlers([InvitationController.sendInvitation])
);

InvitationRoutes.put(
  '/:invitationId/revoke',
  wrappedHandlers([authenticate]),
  wrappedHandlers([InvitationController.revokeInvitation])
);

InvitationRoutes.post(
  '/validate',
  wrappedHandlers([InvitationController.validateInvitation])
);
