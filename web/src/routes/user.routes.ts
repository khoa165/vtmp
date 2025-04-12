import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

const UserRoutes = Router();

UserRoutes.get(
  '/profile',
  wrappedHandlers([authenticate, UserController.getProfile])
);

export default UserRoutes;
