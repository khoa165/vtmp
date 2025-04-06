import { AuthController } from '@/controllers/auth.controller';
import { Router } from 'express';

const AuthRoutes = Router();

AuthRoutes.post('/login', AuthController.login);
AuthRoutes.post('/signup', AuthController.signup); // sign up

export default AuthRoutes;
