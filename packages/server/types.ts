export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: number; // SQLite stores as 0/1
  date: string; // ISO date string
  categoryId?: string;
  userId: string;
}

export interface TodoResponse {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  categoryId?: string;
  userId: string;
}
