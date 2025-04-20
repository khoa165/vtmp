import { InvitationController } from '@/controllers/invitation.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { Router } from 'express';

export const InvitationRoutes = Router();

InvitationRoutes.post(
  '/send-invitation',
  wrappedHandlers([InvitationController.sendInvitationEmail])
);
