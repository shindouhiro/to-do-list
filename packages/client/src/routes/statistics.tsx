import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type Todo, type Category } from '../api'
import { Statistics } from '../components/Statistics'
import { authApi } from '../lib/auth'

export const Route = createFileRoute('/statistics')({
  beforeLoad: async () => {
    if (!authApi.isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: StatisticsPage,
})

function StatisticsPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todosData, categoriesData] = await Promise.all([
          api.todos.getAll(),
          api.categories.getAll()
        ])
        setTodos(todosData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

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
