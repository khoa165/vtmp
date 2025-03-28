import { Router } from 'express';
import AuthController from '@/controllers/auth.controller';

const AuthRoutes = Router();

AuthRoutes.post('/signup', AuthController.signup); // sign up

export default AuthRoutes;
