import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { wrappedHandlers } from '@/middlewares/utils';

export const UserRoutes = Router();
UserRoutes.use(wrappedHandlers([authenticate]));

UserRoutes.get('/', wrappedHandlers([UserController.getAllUsers]));
UserRoutes.get('/:id', wrappedHandlers([UserController.getUser]));
UserRoutes.put('/:id', wrappedHandlers([UserController.updateUser]));
UserRoutes.put('/:id/role', wrappedHandlers([UserController.updateUserRole]));
