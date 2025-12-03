import type { Response } from 'express';
import db from '../db.js';
import { asyncHandler } from '../middleware.js';
import type { Category } from '../types.js';
import type { AuthRequest } from '../auth.js';

/**
 * Category controllers
 */

// Get all categories for current user
export const getAllCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const categories = db.prepare('SELECT * FROM categories WHERE userId = ? ORDER BY name').all(userId) as Category[];
  res.json(categories);
});

// Add category
export const addCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id, name, icon, color } = req.body as Category;

  if (!id || !name || !icon || !color) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const stmt = db.prepare('INSERT INTO categories (id, name, icon, color, userId) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, name, icon, color, userId);

    res.status(201).json({ success: true, id });
  } catch (error: any) {
    // Handle SQLite constraint errors (e.g., duplicate ID)
    if (error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('UNIQUE constraint')) {
      res.status(409).json({ error: `Category with id '${id}' already exists` });
      return;
    }
    throw error; // Re-throw other errors to be handled by asyncHandler
  }
});

// Update category
export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { name, icon, color } = req.body as Partial<Category>;

  const stmt = db.prepare(
    'UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon), color = COALESCE(?, color) WHERE id = ? AND userId = ?'
  );
  const result = stmt.run(name, icon, color, id, userId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json({ success: true });
});


// Delete category
export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM categories WHERE id = ? AND userId = ?');
  const result = stmt.run(id, userId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json({ success: true });
});
