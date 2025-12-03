import type { Response } from 'express';
import db from '../db.js';
import { asyncHandler } from '../middleware.js';
import type { Todo, TodoResponse } from '../types.js';
import type { AuthRequest } from '../auth.js';

/**
 * Todo controllers
 */

// Get all todos for current user
export const getAllTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const todos = db.prepare('SELECT * FROM todos WHERE userId = ? ORDER BY date DESC').all(userId) as Todo[];

  // Convert completed (0/1) to boolean
  const formattedTodos: TodoResponse[] = todos.map(todo => ({
    ...todo,
    completed: Boolean(todo.completed)
  }));

  res.json(formattedTodos);
});

// Add todo
export const addTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id, text, completed, date, categoryId } = req.body;

  if (!id || !text || !date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO todos (id, text, completed, date, categoryId, userId) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, text, completed ? 1 : 0, date, categoryId, userId);

    res.status(201).json({ success: true, id });
  } catch (error: any) {
    // Handle SQLite constraint errors (e.g., duplicate ID)
    if (error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('UNIQUE constraint')) {
      res.status(409).json({ error: `Todo with id '${id}' already exists` });
      return;
    }
    throw error; // Re-throw other errors to be handled by asyncHandler
  }
});

// Update todo
export const updateTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { completed, text, date, categoryId } = req.body;

  // Build dynamic update query
  const updates: string[] = [];
  const values: any[] = [];

  if (completed !== undefined) {
    updates.push('completed = ?');
    values.push(completed ? 1 : 0);
  }
  if (text !== undefined) {
    updates.push('text = ?');
    values.push(text);
  }
  if (date !== undefined) {
    updates.push('date = ?');
    values.push(date);
  }
  if (categoryId !== undefined) {
    updates.push('categoryId = ?');
    values.push(categoryId);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  values.push(id, userId);
  const stmt = db.prepare(`UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND userId = ?`);
  const result = stmt.run(...values);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  res.json({ success: true });
});

// Delete todo
export const deleteTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND userId = ?');
  const result = stmt.run(id, userId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  res.json({ success: true });
});

// Clear all todos for current user
export const clearAllTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const result = db.prepare('DELETE FROM todos WHERE userId = ?').run(userId);
  res.json({ success: true, deletedCount: result.changes });
});

// Bulk add todos
export const bulkAddTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const todos = req.body;

  if (!Array.isArray(todos)) {
    res.status(400).json({ error: 'Expected array of todos' });
    return;
  }

  if (todos.length === 0) {
    res.status(400).json({ error: 'Empty array provided' });
    return;
  }

  const insert = db.prepare(
    'INSERT INTO todos (id, text, completed, date, categoryId, userId) VALUES (@id, @text, @completed, @date, @categoryId, @userId)'
  );

  const insertMany = db.transaction((todos: any[]) => {
    for (const todo of todos) {
      if (!todo.id || !todo.text || !todo.date) {
        throw new Error('Invalid todo data: missing required fields');
      }

      insert.run({
        ...todo,
        completed: todo.completed ? 1 : 0,
        userId
      });
    }
  });

  insertMany(todos);

  res.status(201).json({ success: true, count: todos.length });
});
