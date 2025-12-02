import Dexie, { type EntityTable } from 'dexie';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  categoryId?: string;
}

const db = new Dexie('TodoDatabase') as Dexie & {
  todos: EntityTable<Todo, 'id'>;
  categories: EntityTable<Category, 'id'>;
};

// Version 1: Initial schema
db.version(1).stores({
  todos: 'id, date, completed'
});

// Version 2: Add categories and categoryId to todos
db.version(2).stores({
  todos: 'id, date, completed, categoryId',
  categories: 'id, name'
}).upgrade(async tx => {
  // Add default categories
  const defaultCategories: Category[] = [
    { id: 'work', name: 'Work', icon: 'Briefcase', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', icon: 'User', color: '#10b981' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', color: '#f59e0b' },
    { id: 'health', name: 'Health', icon: 'Heart', color: '#ef4444' },
    { id: 'study', name: 'Study', icon: 'BookOpen', color: '#8b5cf6' },
    { id: 'home', name: 'Home', icon: 'Home', color: '#ec4899' },
  ];

  await tx.table('categories').bulkAdd(defaultCategories);
});

export { db };
