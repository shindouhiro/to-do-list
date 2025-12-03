import { Router } from 'express';
import categoriesRouter from './categories.routes.js';
import todosRouter from './todos.routes.js';

const router = Router();

// Mount sub-routers
router.use('/categories', categoriesRouter);
router.use('/todos', todosRouter);

export default router;
