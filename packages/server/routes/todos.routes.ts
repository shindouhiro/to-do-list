import { Router } from 'express';
import * as todosController from '../controllers/todos.controller.js';

const router = Router();

router.get('/', todosController.getAllTodos);
router.post('/', todosController.addTodo);
router.post('/bulk', todosController.bulkAddTodos);
router.put('/:id', todosController.updateTodo);
router.delete('/:id', todosController.deleteTodo);
router.delete('/', todosController.clearAllTodos);

export default router;
