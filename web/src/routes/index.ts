import { Router } from 'express';
import userRoutes from '@/routes/user.routes';
import todoItemRoutes from './todoItem.routes';

const router = Router();

router.use('/users', userRoutes); // User module
router.use('/todos', todoItemRoutes); // TodoItem module

export default router;
