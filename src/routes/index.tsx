import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { Calendar } from '../components/Calendar'
import { DataToolbar } from '../components/DataToolbar'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const todos = useLiveQuery(() => db.todos.toArray()) ?? []

  const handleAddTodo = async (date: Date, text: string) => {
    await db.todos.add({
      id: crypto.randomUUID(),
      text,
      completed: false,
      date,
    })
  }

  const handleToggleTodo = async (id: string) => {
    const todo = await db.todos.get(id)
    if (todo) {
      await db.todos.update(id, { completed: !todo.completed })
    }
  }

  const handleDeleteTodo = async (id: string) => {
    await db.todos.delete(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Calendar <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Todo</span>
          </h1>
          <p className="text-white/60 text-lg">Organize your life, one day at a time.</p>
        </header>

        {/* Data Management Toolbar */}
        <div className="mb-8 max-w-6xl mx-auto px-6">
          <DataToolbar todos={todos} />
        </div>

        <Calendar
          todos={todos}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </div>
    </div>
  )
}
