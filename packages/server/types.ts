export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: number; // SQLite stores as 0/1
  date: string; // ISO date string
  categoryId?: string;
}

export interface TodoResponse {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  categoryId?: string;
}
