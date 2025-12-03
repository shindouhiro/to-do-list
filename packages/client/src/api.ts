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
  date: Date; // Frontend uses Date object
  categoryId?: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  categories: {
    getAll: async (): Promise<Category[]> => {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
    add: async (category: Category): Promise<void> => {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      if (!res.ok) throw new Error('Failed to add category');
    },
    update: async (id: string, updates: Partial<Category>): Promise<void> => {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update category');
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete category');
    }
  },
  todos: {
    getAll: async (): Promise<Todo[]> => {
      const res = await fetch(`${API_URL}/todos`);
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      // Convert date string to Date object
      return data.map((todo: any) => ({
        ...todo,
        date: new Date(todo.date)
      }));
    },
    add: async (todo: Todo): Promise<void> => {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
      if (!res.ok) throw new Error('Failed to add todo');
    },
    update: async (id: string, updates: Partial<Todo>): Promise<void> => {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update todo');
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete todo');
    },
    clear: async (): Promise<void> => {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to clear todos');
    },
    bulkAdd: async (todos: Todo[]): Promise<void> => {
      const res = await fetch(`${API_URL}/todos/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todos)
      });
      if (!res.ok) throw new Error('Failed to bulk add todos');
    }
  }
};
