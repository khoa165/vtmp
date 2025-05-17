import { AuthController } from '@/controllers/auth.controller';
import { InvitationController } from '@/controllers/invitation.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { Router } from 'express';

export const AuthRoutes = Router();

AuthRoutes.post('/login', wrappedHandlers([AuthController.login]));
AuthRoutes.post('/signup', wrappedHandlers([AuthController.signup])); // sign up
AuthRoutes.post(
  '/validate',
  wrappedHandlers([InvitationController.validateInvitation])
);
