import { createFileRoute, Link } from '@tanstack/react-router'
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Calendar <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Todo</span>
            </h1>
            <Link
              to="/statistics"
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl text-white font-medium transition-all hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Statistics
            </Link>
          </div>
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
