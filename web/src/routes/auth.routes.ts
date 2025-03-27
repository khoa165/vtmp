import { Router } from 'express';
import AuthenticationController from '@/controllers/auth.controller';

const AuthenticationRoutes = Router();

AuthenticationRoutes.post('/signup', AuthenticationController.signup); // sign up

export default AuthenticationRoutes;
