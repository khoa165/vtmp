import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const UserRoutes = Router();

UserRoutes.post('/login', UserController.login);
UserRoutes.get('/profile', authenticate, UserController.getProfile);

export default UserRoutes;
