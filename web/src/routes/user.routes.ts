import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/login', UserController.login);
router.get('/profile', authenticate, UserController.getProfile);

export default router;
