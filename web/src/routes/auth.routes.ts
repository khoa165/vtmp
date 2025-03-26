import AuthController from '@/controllers/auth.controller';
import { Router } from 'express';

const AuthRoutes = Router();

AuthRoutes.post('/login', AuthController.login);

export default AuthRoutes;
