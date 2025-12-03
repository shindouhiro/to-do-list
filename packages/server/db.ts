import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Category } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, 'todo.db');

const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    categoryId TEXT,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
  );
`);

// Add default categories if empty
const count = db.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO categories (id, name, icon, color) VALUES (@id, @name, @icon, @color)');
  const defaultCategories: Category[] = [
    { id: 'work', name: 'Work', icon: 'Briefcase', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', icon: 'User', color: '#10b981' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', color: '#f59e0b' },
    { id: 'health', name: 'Health', icon: 'Heart', color: '#ef4444' },
    { id: 'study', name: 'Study', icon: 'BookOpen', color: '#8b5cf6' },
    { id: 'home', name: 'Home', icon: 'Home', color: '#ec4899' },
  ];

  const insertMany = db.transaction((cats: Category[]) => {
    for (const cat of cats) insert.run(cat);
  });

  insertMany(defaultCategories);
}

export default db;
