import { Router } from 'express';
import categoriesRouter from './categories.routes.js';
import todosRouter from './todos.routes.js';
import authRouter from '../controllers/auth.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// Public routes (no authentication required)
router.use('/auth', authRouter);

// Protected routes (authentication required)
router.use('/categories', authMiddleware, categoriesRouter);
router.use('/todos', authMiddleware, todosRouter);

export default router;
