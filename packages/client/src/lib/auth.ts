export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

const API_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'auth_token'
const REQUEST_TIMEOUT_MS = 10000

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError')
      throw new Error('请求超时，请确认桌面后端已启动后重试')
    throw error
  }
  finally {
    clearTimeout(timer)
  }
}

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY)
  },

  getAuthHeaders: (): HeadersInit => {
    const token = tokenManager.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
}

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await fetchWithTimeout(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      try {
        const error = await res.json()
        throw new Error(error.error || 'Registration failed')
      }
      catch (e) {
        // If response is not JSON or empty, throw a generic error
        if (e instanceof SyntaxError) {
          throw new TypeError(`Registration failed with status ${res.status}`)
        }
        throw e
      }
    }

    const authData: AuthResponse = await res.json()
    tokenManager.setToken(authData.token)
    return authData
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      try {
        const error = await res.json()
        throw new Error(error.error || 'Login failed')
      }
      catch (e) {
        // If response is not JSON or empty, throw a generic error
        if (e instanceof SyntaxError) {
          throw new TypeError(`Login failed with status ${res.status}`)
        }
        throw e
      }
    }

    const authData: AuthResponse = await res.json()
    tokenManager.setToken(authData.token)
    return authData
  },

  logout: (): void => {
    tokenManager.removeToken()
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await fetchWithTimeout(`${API_URL}/auth/me`, {
      headers: {
        ...tokenManager.getAuthHeaders(),
      },
    })

    if (!res.ok) {
      throw new Error('Failed to get current user')
    }

    return res.json()
  },

  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null
  },
}
