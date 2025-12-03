import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { api, type Category } from '../api'
import { CategoryManager } from '../components/CategoryManager'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.categories.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    await api.categories.add({
      id: crypto.randomUUID(),
      ...category,
    })
    await fetchCategories()
  }

  const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
    await api.categories.update(id, updates)
    await fetchCategories()
  }

  const handleDeleteCategory = async (id: string) => {
    await api.categories.delete(id)
    await fetchCategories()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Calendar
          </Link>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
            Category <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Management</span>
          </h1>
          <p className="text-white/60 text-lg">Create and manage your task categories</p>
        </header>

        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>
    </div>
  )
}
