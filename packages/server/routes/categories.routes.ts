import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller.js';

const router = Router();

router.get('/', categoriesController.getAllCategories);
router.post('/', categoriesController.addCategory);
router.put('/:id', categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

export default router;
