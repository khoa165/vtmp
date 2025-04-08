import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const UserRoutes = Router();
UserRoutes.use(authenticate);

UserRoutes.get('/', UserController.getAllUsers);
UserRoutes.get('/:id', UserController.getUser);
UserRoutes.put('/:id', UserController.updateUser);
UserRoutes.put('/:id/role', UserController.updateUserRole);

export default UserRoutes;
