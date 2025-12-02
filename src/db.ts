import Dexie, { type EntityTable } from 'dexie';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

const db = new Dexie('TodoDatabase') as Dexie & {
  todos: EntityTable<Todo, 'id'>;
};

db.version(1).stores({
  todos: 'id, date, completed'
});

export { db };
