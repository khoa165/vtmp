import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { hasPermission } from '@/middlewares/authz.middleware';
import { Permission } from '@/types/enums';

const UserRoutes = Router();

UserRoutes.get(
  '/profile',
  [authenticate, hasPermission(Permission.CREATE_INVITATION)],
  UserController.getProfile
);

export default UserRoutes;
