import { Router } from 'express';
import { InvitationController } from '@/controllers/invitation.controller';
import { wrappedHandlers } from '@/middlewares/utils';

export const InvitationRoutes = Router();

InvitationRoutes.get(
  '/',
  wrappedHandlers([InvitationController.getAllInvitations])
);

InvitationRoutes.post(
  '/',
  wrappedHandlers([InvitationController.sendInvitation])
);

InvitationRoutes.put(
  '/:invitationid/revoke',
  wrappedHandlers([InvitationController.revokeInvitation])
);

InvitationRoutes.post(
  '/validate',
  wrappedHandlers([InvitationController.validateInvitation])
);
