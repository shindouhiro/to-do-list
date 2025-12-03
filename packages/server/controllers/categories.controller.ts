import type { Request, Response } from 'express';
import db from '../db.js';
import { asyncHandler } from '../middleware.js';
import type { Category } from '../types.js';

/**
 * Category controllers
 */

// Get all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all() as Category[];
  res.json(categories);
});

// Add category
export const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id, name, icon, color } = req.body as Category;

  if (!id || !name || !icon || !color) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const stmt = db.prepare('INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)');
    stmt.run(id, name, icon, color);

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
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, icon, color } = req.body as Partial<Category>;

  const stmt = db.prepare(
    'UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon), color = COALESCE(?, color) WHERE id = ?'
  );
  const result = stmt.run(name, icon, color, id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json({ success: true });
});

// Delete category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
  const result = stmt.run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json({ success: true });
});
