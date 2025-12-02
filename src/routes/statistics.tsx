import { createFileRoute, Link } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { Statistics } from '../components/Statistics'

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
})

function StatisticsPage() {
  const todos = useLiveQuery(() => db.todos.toArray()) ?? []
  const categories = useLiveQuery(() => db.categories.toArray()) ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Calendar
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Statistics</span>
          </h1>
          <p className="text-white/60 text-lg">Track your productivity and progress</p>
        </header>

        <Statistics todos={todos} categories={categories} />
      </div>
    </div>
  )
}
