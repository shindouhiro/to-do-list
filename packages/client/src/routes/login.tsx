import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authApi, type LoginRequest } from '../lib/auth'
import { LogIn } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authApi.login(formData)
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-white/60 text-center mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all shadow-lg hover:scale-105"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
