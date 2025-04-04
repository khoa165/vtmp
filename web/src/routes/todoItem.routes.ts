import { Router } from 'express';
import TodoItemController from '@/controllers/todoItem.controller';

const router = Router();

router.get('/get', TodoItemController.getAllTodoItems);
router.post('/mock', TodoItemController.createMock);
router.post('/updatePoints', TodoItemController.updatePoints);
router.post('/markDone', TodoItemController.markItemAsDone);

export default router;
