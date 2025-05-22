import { AuthController } from '@/controllers/auth.controller';
import { wrappedHandlers } from '@/middlewares/utils';
import { Router } from 'express';

export const AuthRoutes = Router();

AuthRoutes.post('/login', wrappedHandlers([AuthController.login]));
AuthRoutes.post('/signup', wrappedHandlers([AuthController.signup])); // sign up
AuthRoutes.post(
  '/request-password-reset',
  wrappedHandlers([AuthController.requestPasswordReset])
);
AuthRoutes.patch(
  '/reset-password',
  wrappedHandlers([AuthController.resetPassword])
);
