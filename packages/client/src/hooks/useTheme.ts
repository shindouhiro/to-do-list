import { useEffect, useState } from 'react'

export type Theme = 'default' | 'ocean' | 'forest' | 'cyberpunk' | 'sunset' | 'dracula'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme
    return savedTheme || 'default'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return {
    theme,
    setTheme,
  }
}
